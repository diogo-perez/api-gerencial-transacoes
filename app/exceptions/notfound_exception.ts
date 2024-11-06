import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

/**
 * Classe para tratar exceções de não encontrado.
 * Herda da classe Exception do AdonisJS.
 */
export default class NotFoundException extends Exception {
  /**
   * Método responsável por lidar com a exceção e retornar uma resposta ao cliente.
   * @param error - O erro que ocorreu.
   * @param {HttpContext} ctx - O contexto HTTP da requisição.
   */
  async handle(error: any, { response }: HttpContext) {
    return response.status(404).send({
      status: false,
      message: 'Registro não localizado',
      errors: error.message,
    })
  }
}
