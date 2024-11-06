import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'

/**
 * Classe para manipulação de exceções HTTP.
 */
export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction

  /**
   * Método responsável por lidar com erros e retornar respostas ao cliente.
   * @param error - O erro que ocorreu.
   * @param {HttpContext} ctx - O contexto HTTP da requisição.
   */
  async handle(error: any, { response }: HttpContext) {
    // Atribui um código ao erro caso não exista.
    error.code = error.code ?? error.cause?.code

    // Tratamento de erro de validação
    if (error.code === 'E_VALIDATION_ERROR') {
      const formattedErrors = error.messages.reduce(
        (acc: { [x: string]: any }, curr: { field: string | number; message: any }) => {
          acc[curr.field] = curr.message // Formata os erros de validação
          return acc
        },
        {}
      )

      return response.status(error.status).send({
        status: false,
        message: 'Falha na validação',
        errors: formattedErrors,
      })
    }

    // Tratamento para erro de linha não encontrada
    if (error.code === 'E_ROW_NOT_FOUND') {
      return response.status(404).send({
        status: false,
        message: `Informação não encontrada. ${error.message}`,
        data: null,
      })
    }

    // Tratamento para rota não encontrada
    if (error.code === 'E_ROUTE_NOT_FOUND') {
      return response.status(error.status).send({
        status: false,
        message: 'Endpoint inválido',
        data: 'Verifique os parâmetros e o caminho informados',
      })
    }

    // Tratamento para acesso não autorizado
    if (error.code === 'E_UNAUTHORIZED_ACCESS') {
      return response.status(400).send({
        status: false,
        message: 'Credenciais inválidas',
        data: `Token de acesso inválido`,
      })
    }

    // Tratamento para erro de campo nulo
    if (error.code === '23502') {
      return response.status(400).send({
        status: false,
        message: 'Dados inválidos',
        data: `O campo ${error.cause.column} não pode ser nulo`,
      })
    }

    // Tratamento para erro interno do servidor
    if (error.cause?.data) {
      return response.status(error.cause.status || 500).send({
        status: false,
        message: 'Erro interno do servidor',
        errors: error.cause.data.msg,
      })
    }

    // Tratamento específico para erros internos na plataforma USE Boletos
    if (error.response?.status == 514) {
      return response.status(404).send({
        status: false,
        message: `Erro interno na plataforma USE Boletos. Tente novamente`,
        data: null,
      })
    }

    // Tratamento específico para erros internos na plataforma Mesh
    if (error.cause?.cause?.status == 514) {
      return response.status(404).send({
        status: false,
        message: `Erro interno na plataforma Mesh. Tente novamente`,
        data: null,
      })
    }

    // Ajuste da mensagem de erro caso exista
    if (error.cause?.cause && error?.cause?.cause?.msg) {
      error.message = error.cause.cause.msg || error.cause.msg
    }

    // Tratamento padrão para outros erros
    return response.status(error.status || 500).send({
      status: false,
      message: 'Erro interno do servidor',
      errors: error.message,
    })
  }

  /**
   * Método para relatar erros a serviços de log ou serviços de monitoramento de terceiros.
   * @note Não tente enviar uma resposta a partir deste método.
   * @param error - O erro que ocorreu.
   * @param ctx - O contexto HTTP da requisição.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx) // Chama o método padrão para relatar o erro
  }
}
