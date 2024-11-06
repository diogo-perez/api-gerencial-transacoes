import path from 'node:path'
import url from 'node:url'

export default {
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../',
  title: 'Foo',
  version: '1.0.0',
  description: '',
  tagIndex: 2,
  info: {
    title: 'API - Gerencial Financeiro',
    version: '1.0.0',
    description:
      'API desenvolvida em AdonisJS v6 com integração com a plataforme de pagamentos Mesh e USE Boletos para uso interno do setor Financeiro da empresa Pax Primavera ',
  },
  snakeCase: true,
  debug: false,
  ignore: ['/swagger', '/docs'],
  preferredPutPatch: 'PUT',
  common: {
    parameters: {},
    headers: {},
  },
  securitySchemes: {},
  authMiddlewares: ['auth', 'auth:api'],
  defaultSecurityScheme: 'BearerAuth',
  persistAuthorization: true,
  showFullPath: false,
}
