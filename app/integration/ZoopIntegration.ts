import ApiService from '../utils/api.js'

export default class ZoopIntegration {
  /**
   * Consulta transações de um estabelecimento entre duas datas.
   * @param { string } inicio - Data e hora de início da consulta.
   * @param { string } fim - Data e hora de fim da consulta.
   * @param { any } item - Dados do estabelecimento.
   * @returns { Promise<any[]> } - Retorna a lista de transações.
   */
  public static async consultarTransacoes(
    inicio: string,
    fim: string,
    item: any,
    tentativa = 1
  ): Promise<any[]> {
    let page = 1
    let transacoes = []
    let nextPage = true

    try {
      while (nextPage) {
        const filter = `?limit=1000&page=${page}&offset=0&date_range[gte]=${inicio}&date_range[lte]=${fim}&status=succeeded,canceled`
        const options = {
          method: 'get',
          maxBodyLength: Infinity,
          url: `https://api.zoop.ws/v1/marketplaces/${item.identificador}/sellers/${item.seller}/transactions${filter}`,
          headers: {
            accept: 'application/json',
            authorization: 'Basic ' + item.chave,
          },
        }
        try {
          const result: any = await ApiService.apiRequest(options)

          if (result.items) {
            transacoes.push(...result.items)
            nextPage = page < result.total_pages
            page++
            tentativa++
          } else {
            nextPage = false
          }
        } catch (error) {
          if (tentativa < 3) {
            console.warn(`Erro ao consultar transações. Tentativa ${tentativa} de 3.`)
            return await ZoopIntegration.consultarTransacoes(inicio, fim, item, tentativa + 1) // Chama novamente a função
          } else {
            throw new Error(error.message, { cause: error })
          }
        }
      }
      return transacoes
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  /**
   * Consulta o saldo de um estabelecimento.
   * @param { any } item - Dados do estabelecimento.
   * @returns { Promise<string> } - Retorna o saldo atual.
   */
  public static async consultarSaldo(item: any): Promise<string> {
    try {
      const options = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.zoop.ws/v1/marketplaces/${item.identificador}/sellers/${item.seller}/balances`,
        headers: {
          accept: 'application/json',
          authorization: 'Basic ' + item.chave,
        },
      }
      const saldo: any = await ApiService.apiRequest(options)
      return saldo && saldo.items && saldo.items.current_balance
        ? (saldo.items.current_balance / 100).toFixed(2)
        : '0.00'
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  /**
   * Busca a descrição de um terminal baseado na transação e integração fornecidas.
   * @param { any } transacao - Dados da transação.
   * @param { any } integracao - Dados de integração do estabelecimento.
   * @param { any[] } terminais - Lista de terminais cadastrados localmente.
   * @returns { Promise<string> } - Retorna a descrição do terminal.
   */
  public static async buscarTerminal(
    transacao: any,
    integracao: any,
    terminais: any
  ): Promise<string> {
    try {
      const identificadorTerminal = transacao.point_of_sale.identification_number
      if (!identificadorTerminal) return 'TERMINAL NÃO LOCALIZADO'

      const terminalLocal = terminais.find(
        (item: { identificador: any }) => item.identificador == identificadorTerminal
      )
      if (terminalLocal) {
        return terminalLocal.descricao || terminalLocal.serial
      }

      const options = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.zoop.ws/v1/card-present/terminals/${identificadorTerminal}`,
        headers: {
          accept: 'application/json',
          authorization: 'Basic ' + integracao.chave,
        },
      }
      // Busca o terminal pelo seu identificador na API da Zoop!
      const result: any = await ApiService.apiRequest(options)
      // Retorna o serial do terminal!
      return result.serial_number
    } catch (error) {
      // Retorna caso o terminal não tenha sido localizado!
      return 'TERMINAL NÃO LOCALIZADO'
    }
  }
}
