import Terminal from '#models/Terminal'
import moment from 'moment'
import { HttpContext } from '@adonisjs/core/http'
import Estabelecimento from '#models/Estabelecimento'
import { isValidaFormatoData } from '../utils/format.js'
import ZoopIntegration from '../integration/ZoopIntegration.js'

/**
 * ZoopService - Serviço para gerenciar interações com a API externa Zoop.
 */
export default class ZoopService {
  /**
   * @index
   * @summary Retorna a descrição do tipo de pagamento baseado no código fornecido.
   *
   * @operationId tipoPagamento
   * @tag Mesh
   *
   * @param tipo - Código ou tipo de pagamento - @type(string|number)
   * @returns {string} - Descrição do tipo de pagamento correspondente.
   */
  private tipoPagamento(tipo: string | number): string {
    const tiposPagamento: { [key: string]: string } = {
      debit: 'DÉBITO',
      credit: 'CRÉDITO',
      pix: 'PIX',
      default: 'OUTROS',
    }

    if (typeof tipo === 'string' && tipo in tiposPagamento) {
      return tiposPagamento[tipo]
    }
    return tiposPagamento.default
  }

  /**
   * @index
   * @summary Retorna o status do pagamento baseado no código fornecido.
   *
   * @operationId statusPagamento
   * @tag Mesh
   *
   * @param status - Código de status do pagamento - @type(string)
   * @returns {string} - Descrição do status do pagamento correspondente.
   */
  private statusPagamento(status: string): string {
    const statusPagamento: { [key: string]: string } = {
      succeeded: 'SUCESSO',
      canceled: 'CANCELADO',
      default: '',
    }

    if (typeof status === 'string' && status in statusPagamento) {
      return statusPagamento[status]
    }
    return statusPagamento.default
  }

  /**
   * @index
   * @summary Busca transações financeiras entre datas específicas para estabelecimentos selecionados.
   *
   * @operationId buscarTransacoes
   * @tag Mesh
   *
   * @param {HttpContext} context - Contexto da requisição HTTP.
   * @param {string} dataInicial - Data inicial para o filtro - @type(string)
   * @param {string} dataFinal - Data final para o filtro - @type(string)
   * @param {Array} unidades - IDs dos estabelecimentos - @type(array)
   *
   * @responseBody 200 - { status: true, mensagem: "Transações retornadas com sucesso!", dados: { retorno: Array } } - Transações filtradas.
   * @responseBody 400 - { status: false, mensagem: "Parâmetros dataInicial e dataFinal são obrigatórios e devem estar no formato aaaa-mm-dd" } - Erro na validação dos parâmetros.
   * @responseBody 500 - { status: false, mensagem: "Falha interna do servidor! Contate o suporte." } - Erro interno.
   */
  public async buscarTransacoes({ response, params, request, auth }: HttpContext): Promise<void> {
    try {
      const { unidades: estabelecimentoIds } = request.only(['unidades'])
      const { dataInicial, dataFinal } = params

      // Verifica se as datas são válidas e estão no formato correto
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

      const query = Estabelecimento.query().whereNot('tipo', 3)

      // Filtra os estabelecimentos se IDs forem fornecidos
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
      const terminais = await Terminal.query()

      // Prepara as datas de início e fim para a consulta
      const inicio = moment(`${dataInicial}T04:00:00.000Z`).toISOString()
      const fim = moment(`${dataFinal}T03:59:59.999Z`).add(1, 'day').toISOString()

      // Coleta as transações dos estabelecimentos
      const retorno = await this.coletarTransacoes(estabelecimentos, inicio, fim, terminais)

      return response
        .status(200)
        .send({ status: true, mensagem: 'Transações retornadas com sucesso!', dados: { retorno } })
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  /**
   * @index
   * @summary Coleta e organiza as transações financeiras de estabelecimentos em um período de tempo especificado.
   *
   * @operationId coletarTransacoes
   * @tag Mesh
   *
   * @param {Array} estabelecimentos - Lista de estabelecimentos - @type(array)
   * @param {string} inicio - Data e hora de início da busca - @type(string)
   * @param {string} fim - Data e hora de fim da busca - @type(string)
   * @param {Array} terminais - Lista de terminais - @type(array)
   *
   * @returns {Promise<Array>} - Retorna um array de transações organizadas por estabelecimento.
   */
  private async coletarTransacoes(
    estabelecimentos: any[],
    inicio: string,
    fim: string,
    terminais: any[]
  ): Promise<any[]> {
    const retorno = []

    for (const item of estabelecimentos) {
      // Consulta as transações e saldo do estabelecimento
      const transacoes = await ZoopIntegration.consultarTransacoes(inicio, fim, item)
      const saldoFinal = await ZoopIntegration.consultarSaldo(item)
      retorno.push({
        id: item.id,
        estabelecimento: item.nome,
        regiao: item.regiao,
        cnpj: item.cnpj,
        saldo: {
          quantidade: transacoes.length,
          total: transacoes
            .reduce((total, transacao) => total + parseFloat(transacao.amount), 0)
            .toFixed(2),
          tarifa: transacoes
            .reduce((total, transacao) => total + parseFloat(transacao.fees), 0)
            .toFixed(2),
          saldo: saldoFinal,
          transacoes: await Promise.all(
            transacoes.map(async (transacao) => {
              const descricaoTerminal = await ZoopIntegration.buscarTerminal(
                transacao,
                item,
                terminais
              )
              return {
                id: transacao.id,
                status: this.statusPagamento(transacao.status),
                total: transacao.amount,
                forma_pagamento: this.tipoPagamento(transacao.payment_type),
                cliente: transacao.payment_method.holder_name || '',
                primeiros_digitos: transacao.payment_method.first4_digits || '0000',
                ultimos_digitos: transacao.payment_method.last4_digits || '0000',
                data: moment(transacao.updated_at).format('YYYY-MM-DD'),
                hora: moment(transacao.updated_at).utcOffset('-04:00').format('HH:mm'),
                terminal: descricaoTerminal,
                taxa: transacao.fees,
              }
            })
          ),
        },
      })
    }

    return retorno
  }
}
