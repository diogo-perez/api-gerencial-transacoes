import ApiService from '../utils/api.js'

export default class UseIntegration {
  /**
   * Chama a API para consultar o saldo de um estabelecimento.
   * @param identificador - O identificador do estabelecimento.
   * @param chave - A chave do estabelecimento.
   * @returns { Promise<any> } - Retorna o saldo do estabelecimento.
   */
  public static async consultarSaldoService(identificador: string, chave: string): Promise<any> {
    const options = {
      method: 'GET',
      url: `https://api.useboletos.com.br/credenciados/v1/${identificador}/saldo`,
      headers: {
        'Content-Type': 'application/json',
        'X-Credenciado-Chave': chave,
      },
    }
    return ApiService.apiRequest(options)
  }

  /**
   * Chama a API para consultar os recebimentos de um estabelecimento.
   * @param identificador - O identificador do estabelecimento.
   * @param chave - A chave do estabelecimento.
   * @param dataInicial - Data inicial para a consulta.
   * @param dataFinal - Data final para a consulta.
   * @returns { Promise<any> } - Retorna os recebimentos do estabelecimento.
   */
  public static async consultarRecebimentosService(
    identificador: string,
    chave: string,
    dataInicial: string,
    dataFinal: string
  ): Promise<any> {
    const options = {
      method: 'POST',
      url: `https://api.useboletos.com.br/credenciados/v1/${identificador}/cobrancas-pagas`,
      headers: {
        'Content-Type': 'application/json',
        'X-Credenciado-Chave': chave,
      },
      params: {
        data_inicio: dataInicial,
        data_fim: dataFinal,
      },
    }
    return ApiService.apiRequest(options)
  }

  /**
   * Chama a API para solicitar o repasse de um estabelecimento.
   * @param identificador - O identificador do estabelecimento.
   * @param chave - A chave do estabelecimento.
   * @returns { Promise<any> } - Retorna a resposta da solicitação de repasse.
   */
  public static async solicitarRepasseService(identificador: string, chave: string): Promise<any> {
    const options = {
      method: 'POST',
      url: `https://api.useboletos.com.br/credenciados/v1/${identificador}/repasse`,
      headers: {
        'Content-Type': 'application/json',
        'X-Credenciado-Chave': chave,
      },
    }
    return ApiService.apiRequest(options)
  }
}
