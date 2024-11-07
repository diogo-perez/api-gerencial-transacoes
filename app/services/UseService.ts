import Estabelecimento from '#models/Estabelecimento'
import { HttpContext } from '@adonisjs/core/http'
import UseIntegration from '../integration/UseIntegration.js'
import { Dados, Pagamento, Recebimento, Transacao } from '../interfaces/UseInterface.js'
import { formatarData, isValidaFormatoData } from '../utils/format.js'

/**
 * UseService é uma classe responsável por manipular operações relacionadas a estabelecimentos,
 * incluindo consultas de saldo, recebimentos e solicitações de repasse.
 */
export default class UseService {
  /**
   * Consulta o saldo de um estabelecimento.
   *
   * @param {Estabelecimento} item - O estabelecimento a ser consultado.
   * @returns {Promise<{ saldo: number; status: boolean; message: string }>} - Retorna o saldo do estabelecimento.
   * @throws {Error} - Lança um erro caso a consulta falhe.
   */
  private async consultarSaldo(
    item: Estabelecimento
  ): Promise<{ saldo: number; status: boolean; message: string }> {
    try {
      const response: any = await UseIntegration.consultarSaldoService(
        item.identificador,
        item.chave
      )
      return {
        saldo: response.saldo_atual,
        status: true,
        message: 'Saldo retornado com sucesso',
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  /**
   * Consulta os recebimentos de um estabelecimento dentro de um intervalo de datas.
   *
   * @param {Estabelecimento} item - O estabelecimento a ser consultado.
   * @param {any} params - Parâmetros da consulta (dataInicial e dataFinal).
   * @returns {Promise<{ dados?: Recebimento[]; status: boolean; message: string }>} - Retorna os recebimentos do estabelecimento.
   * @throws {Error} - Lança um erro caso a consulta falhe.
   */
  private async consultarRecebimentos(
    item: Estabelecimento,
    params: any
  ): Promise<{ dados?: Recebimento[]; status: boolean; message: string }> {
    const { dataInicial, dataFinal } = params
    try {
      const response: any = await UseIntegration.consultarRecebimentosService(
        item.identificador,
        item.chave,
        dataInicial,
        dataFinal
      )
      return {
        dados: response as Recebimento[],
        status: true,
        message: 'Recebimentos consultados com sucesso',
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  /**
   * Solicita um repasse para um estabelecimento.
   *
   * @param {HttpContext} ctx - O contexto da requisição.
   * @returns {Promise<void>} - Retorna a resposta da requisição.
   * @throws {Error} - Lança um erro caso o repasse não possa ser solicitado.
   */
  public async repasse({ response, params }: HttpContext): Promise<void> {
    try {
      const { identificador } = params
      const estabelecimento = await Estabelecimento.findBy('id', identificador)

      if (!estabelecimento) {
        return response
          .status(404)
          .send({ status: false, mensagem: 'Estabelecimento não encontrado' })
      }

      await UseIntegration.solicitarRepasseService(
        estabelecimento.identificador,
        estabelecimento.chave
      )

      return response.status(200).send({ status: true, mensagem: 'Repasse solicitado com sucesso' })
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  /**
   * Busca recebimentos de estabelecimentos dentro de um intervalo de datas.
   *
   * @param {HttpContext} ctx - O contexto da requisição.
   * @returns {Promise<void>} - Retorna a resposta com os dados dos recebimentos e eventuais erros.
   * @throws {Error} - Lança um erro caso a busca falhe ou algum parâmetro inválido seja fornecido.
   */
  public async buscarRecebimentos(ctx: HttpContext): Promise<void> {
    const { response, params, request, auth } = ctx
    try {
      const { unidades: estabelecimentoIds } = request.only(['unidades'])
      const { dataInicial, dataFinal } = params
      const page = Number(request.input('page', 1)) // Página atual, default 1
      const perPage = Number(request.input('perPage', 20)) // Itens por página, default 20

      if (
        !dataInicial ||
        !dataFinal ||
        !isValidaFormatoData(dataInicial) ||
        !isValidaFormatoData(dataFinal)
      ) {
        return response.status(400).send({
          status: false,
          mensagem:
            'Parâmetros dataInicial e dataFinal são obrigatórios e devem estar no formato aaaa-mm-dd',
        })
      }

      // Busca os estabelecimentos filtrados
      const query = Estabelecimento.query().where('tipo', 3)

      if (estabelecimentoIds && estabelecimentoIds.length > 0) {
        query.whereIn('id', estabelecimentoIds)
      } else {
        const user = await auth.authenticate()

        if (user.unidades && user.unidades.length > 0) {
          query.whereIn('id', user.unidades)
        } else {
          return response.status(403).send({
            status: false,
            mensagem: 'Usuário não possui unidades associadas para acesso.',
          })
        }
      }

      const estabelecimentos = await query.orderBy('nome', 'asc')
      if (estabelecimentos.length <= 0) {
        return response
          .status(400)
          .send({ status: false, mensagem: 'Unidades do tipo 3 não localizadas' })
      }
      const dados: Dados[] = []
      const erros: { unidade_id: number; value: string }[] = []
      for (const estabelecimento of estabelecimentos) {
        try {
          const [recebimentosResponse, saldoFinal] = await Promise.all([
            this.consultarRecebimentos(estabelecimento, { dataInicial, dataFinal }),
            this.consultarSaldo(estabelecimento),
          ])

          if (recebimentosResponse.status) {
            const recebimentos = recebimentosResponse.dados || []

            const transacoes: Transacao[] = recebimentos
              .flatMap((recebimento) =>
                recebimento.pagamentos.map((pagamento: Pagamento) => ({
                  cliente: recebimento.sacado_razao,
                  valor_boleto: recebimento.valor_cobranca,
                  pedido: recebimento.pedido_numero,
                  observacao: recebimento.observacao,
                  origem: recebimento.tipo_cobranca,
                  forma_pagamento: this.tipoPagamento(
                    pagamento.origem_pagamento,
                    recebimento.tipo_cobranca
                  ),
                  data_documento: formatarData(recebimento.data_documento),
                  data_vencimento: formatarData(recebimento.data_vencimento),
                  data_pagamento: formatarData(pagamento.data_quitacao),
                  total: parseFloat(pagamento.valor_pago),
                  taxa: parseFloat(pagamento.valor_taxa_credenciado),
                }))
              )
              .sort((a, b) => {
                const dateA = new Date(a.data_pagamento)
                const dateB = new Date(b.data_pagamento)
                if (dateA < dateB) return -1
                if (dateA > dateB) return 1
                return a.cliente.localeCompare(b.cliente)
              })

            const totalTransacoes = transacoes.length
            const totalValor = parseFloat(
              transacoes.reduce((acc, curr) => acc + curr.total, 0).toFixed(2)
            )
            const totalTarifa = parseFloat(
              transacoes.reduce((acc, curr) => acc + curr.taxa, 0).toFixed(2)
            )

            dados.push({
              id: estabelecimento.id,
              estabelecimento: estabelecimento.nome,
              regiao: estabelecimento.regiao,
              cnpj: estabelecimento.cnpj,
              repasse: estabelecimento.repasse,
              saldo: {
                quantidade: totalTransacoes,
                total: totalValor,
                tarifa: totalTarifa,
                saldo: saldoFinal.saldo,
                transacoes,
              },
            })
          } else {
            // Adiciona a mensagem de erro se o status for false
            erros.push({ unidade_id: estabelecimento.id, value: recebimentosResponse.message })
          }
        } catch (innerError) {
          erros.push({
            unidade_id: estabelecimento.id,
            value: `Erro ao processar o estabelecimento ${estabelecimento.nome}: ${innerError.message}`,
          })
        }
      }
      // Implementa paginação manual nos dados processados
      const totalItems = dados.length
      const paginatedData = dados.slice((page - 1) * perPage, page * perPage)
      const totalPages = Math.ceil(totalItems / perPage)
      return response.status(200).send({
        status: true,
        mensagem: 'Transações retornadas com sucesso',
        dados: paginatedData,
        meta: {
          paginaAtual: page,
          totalPaginas: totalPages,
          totalItems,
        },
        erros: erros.length > 0 ? erros : undefined,
      })
    } catch (error: any) {
      throw new Error(error.message, { cause: error })
    }
  }

  /**
   * Função auxiliar para determinar o tipo de pagamento com base no tipo e cobrança.
   *
   * @param tipo - O tipo de pagamento (ex: "PIX", "BOLETO").
   * @param cobranca - O tipo de cobrança (ex: "BOLETO_PIX").
   * @returns {string} - Retorna uma string representando o tipo de pagamento.
   */
  private tipoPagamento(tipo: string, cobranca: string): string {
    if (cobranca === 'BOLETO_PIX') {
      if (tipo === 'PIX') return 'QRCODE BOLETO'
      if (tipo === 'BOLETO') return 'BOLETO'
    } else if (cobranca === 'PIX_AVULSO' && tipo === 'PIX') {
      return 'PIX'
    }
    return 'OUTROS'
  }
}
