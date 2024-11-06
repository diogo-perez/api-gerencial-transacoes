import axios from 'axios'

/**
 * Classe ApiService para realizar requisições HTTP usando Axios.
 * Fornece um método estático para encapsular a lógica de requisições e tratamento de erros.
 */
export default class ApiService {
  /**
   * Realiza uma requisição API com as opções fornecidas.
   * @param options - Objeto de opções para a requisição Axios, que inclui método, URL, cabeçalhos, etc.
   * @returns A resposta da requisição em formato de dados.
   * @throws Um objeto de erro que contém detalhes sobre o erro, se a requisição falhar.
   */
  public static async apiRequest(options: any) {
    try {
      // Realiza a requisição usando Axios com as opções fornecidas
      const response = await axios(options)

      // Retorna os dados da resposta
      return response.data
    } catch (error) {
      // Verifica se o erro é um erro do Axios
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data.msg, // Mensagem do erro retornada pela API
          status: error.response?.status, // Status HTTP da resposta
          data: error.response?.data, // Dados da resposta da API
          cause: error.message, // Mensagem de erro original
        }
      } else {
        // Lida com erros inesperados
        throw {
          message: `Erro inesperado ao fazer a requisição para ${error.response?.data}`,
          cause: error.message, // Mensagem de erro original
        }
      }
    }
  }
}
