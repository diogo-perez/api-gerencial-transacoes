const EstabelecimentoController = () => import('#controllers/EstabelecimentoController')
const TerminalController = () => import('#controllers/TerminalController')
const UsuarioController = () => import('#controllers/UsuarioController')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const UseService = () => import('#services/UseService')
const ZoopService = () => import('#services/ZoopService')
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

router
  .get('/docs', async () => {
    return AutoSwagger.default.ui('/swagger', swagger)
  })
  .use(middleware.docsAuth())

router
  .group(() => {
    // Rota para login
    router.post('login', [UsuarioController, 'login'])

    // Rotas para Usuário
    router
      .group(() => {
        router.get('/', [UsuarioController, 'listar']) // Lista todos os usuários
        router.post('/', [UsuarioController, 'criar']) // Cria um novo usuário
        router.get('/:id', [UsuarioController, 'mostrar']).where('id', router.matchers.number()) // Mostra detalhes de um usuário específico
        router.put('/:id', [UsuarioController, 'atualizar']).where('id', router.matchers.number()) // Atualiza um usuário específico
        router.delete('/:id', [UsuarioController, 'deletar']).where('id', router.matchers.number()) // Deleta um usuário específico
      })
      .prefix('usuarios')
      .use(middleware.auth())

    // Rotas para Terminal
    router
      .group(() => {
        router.get('/', [TerminalController, 'listar']) // Lista todos os terminais
        router.post('/', [TerminalController, 'criar']) // Cria um novo terminal
        router.get('/:id', [TerminalController, 'mostrar']).where('id', router.matchers.number()) // Mostra detalhes de um terminal específico
        router.put('/:id', [TerminalController, 'atualizar']).where('id', router.matchers.number()) // Atualiza um terminal específico
        router.delete('/:id', [TerminalController, 'deletar']).where('id', router.matchers.number()) // Deleta um terminal específico
      })
      .prefix('terminais')
      .use(middleware.auth())

    // Rotas para Estabelecimento
    router
      .group(() => {
        router.get('/', [EstabelecimentoController, 'listar']) // Lista todos os estabelecimentos
        router.post('/', [EstabelecimentoController, 'criar']) // Cria um novo estabelecimento
        router
          .get('/:id', [EstabelecimentoController, 'mostrar'])
          .where('id', router.matchers.number()) // Mostra detalhes de um estabelecimento específico
        router
          .put('/:id', [EstabelecimentoController, 'atualizar'])
          .where('id', router.matchers.number()) // Atualiza um estabelecimento específico
        router
          .delete('/:id', [EstabelecimentoController, 'deletar'])
          .where('id', router.matchers.number()) // Deleta um estabelecimento específico
      })
      .prefix('estabelecimentos')
      .use(middleware.auth())

    // Rotas para USE
    router
      .group(() => {
        router.post('/transacao/:dataInicial/:dataFinal', [UseService, 'buscarRecebimentos']) // Busca recebimentos entre datas
        router.post('/repasse/:identificador', [UseService, 'repasse']) // Realiza um repasse com identificador
      })
      .prefix('use')
      .use(middleware.auth())

    // Rotas para ZOOP
    router
      .group(() => {
        router.post('transacao/:dataInicial/:dataFinal', [ZoopService, 'buscarTransacoes']) // Busca transações entre datas
      })
      .prefix('mesh')
      .use(middleware.auth())
  })
  .prefix('api/v1')
