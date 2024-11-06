import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Middleware de Autenticação para Acesso à Documentação da API.
 *
 * Esta classe serve para autenticar o acesso à documentação da API, utilizando
 * o método de autenticação Basic padrão. Para acessar a documentação,
 * o usuário deve fornecer credenciais válidas.
 */
export default class DocsAuthMiddleware {
  /**
   * Manipulador principal do middleware.
   *
   * @param ctx - O contexto da requisição HTTP, que contém informações sobre a requisição,
   *              como cabeçalhos e parâmetros.
   * @param next - Função que chama o próximo middleware na pilha.
   *
   * @returns {Promise<void>} - Retorna uma Promise que resolve quando o próximo middleware é chamado.
   *
   * @throws {HttpResponse} - Retorna uma resposta HTTP com status 401 se a autenticação falhar.
   */
  async handle(ctx: HttpContext, next: NextFn) {
    // Verifica se as informações de autenticação foram passadas.
    const authHeader = ctx.request.header('authorization')

    // Se o cabeçalho de autenticação não estiver presente, solicita autenticação.
    if (!authHeader) {
      ctx.response.header('WWW-Authenticate', 'Basic')
      return ctx.response.status(401).send('Authorization required')
    }

    // Converte as informações passadas de base64 para um formato legível.
    const base64Credentials = authHeader.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')

    // Valida se as informações passadas estão corretas.
    // OBS: Necessário configurar as variáveis de ambiente no arquivo .env
    if (username === env.get('DOC_USER') && password === env.get('DOC_PASSWORD')) {
      // Se as credenciais estiverem corretas, chama o próximo middleware.
      await next()
    } else {
      // Se as credenciais forem inválidas, solicita autenticação novamente.
      ctx.response.header('WWW-Authenticate', 'Basic')
      return ctx.response.status(401).send('Invalid credentials')
    }
  }
}
