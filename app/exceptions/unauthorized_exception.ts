import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

/**
 * Classe para tratar exceções de não autorizado.
 * Herda da classe Exception do AdonisJS.
 */
export default class UnauthorizedException extends Exception {
  /**
   * Método responsável por lidar com a exceção e retornar uma resposta ao cliente.
   * @param error - O erro que ocorreu.
   * @param {HttpContext} ctx - O contexto HTTP da requisição.
   */
  async handle(error: any, { response }: HttpContext) {
    return response.status(error.status).send({
      status: false,
      message: 'Falha na autenticação',
      errors: error.message,
    })
  }
}
