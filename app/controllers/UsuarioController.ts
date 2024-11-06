import UsuarioService from '#services/UsuarioService'
import { HttpContext } from '@adonisjs/core/http'
import {
  usuarioCreateValidator,
  usuarioLogin,
  usuarioUpdateValidator,
} from '#validators/UsuarioValidator'
import EstabelecimentoService from '#services/EstabelecimentoService'

/**
 * UsuarioController - Controlador para gerenciar usuarios.
 */
export default class UsuarioController {
  private usuarioService = new UsuarioService()
  private estabelecimentoService = new EstabelecimentoService()

  /**
   * @login
   * @summary Login de usuário
   *
   * @operationId Login
   * @tag Usuário
   *
   * @requestBody <login>
   *
   * @responseBody 200 - <ResponseById> - Retorna os dados do usuário autenticado.
   * @responseBody 400 - {status: false, message: "Falha ao processar requisição!", data: {}}
   * @responseBody 401 - {status: false, message: "Usuário não autenticado!", data: {}}
   * @responseBody 403 - {status: false, message: "Usuário não possui permissão de acesso ao recurso!", data: {}}
   * @responseBody 404 - {status: false, message: "Usuário não localizado!", data: {}}
   * @responseBody 500 - {status: false, message: "Falha interna do servidor! Contate o suporte.", data: {}}
   */
  public async login({ request, response }: HttpContext): Promise<void> {
    const payload = await usuarioLogin.validate(request.all())
    const result = await this.usuarioService.autenticar(payload.cpf, payload.senha)
    return response.status(201).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }

  /**
   * @listar
   * @summary Lista todos os usuários cadastrados.
   *
   * @operationId Listar
   * @tag Usuário
   *
   * @responseBody 200 - { status: true, message: string, data: any } - Retorna a lista de usuários.
   * @responseBody 404 - { status: false, message: string, data: {} } - Retorna erro se não encontrar usuários.
   */
  public async listar({ response }: HttpContext): Promise<void> {
    const result = await this.usuarioService.listarUsuarios()
    return response.status(200).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }

  /**
   * @criar
   * @summary Cria um novo usuário no sistema.
   *
   * @operationId Criar
   * @tag Usuário
   *
   * @paramBody {string} nome - Nome do novo usuário.
   * @paramBody {string} cpf - CPF do novo usuário.
   * @paramBody {string} senha - Senha do novo usuário.
   * @paramBody {number[]} unidades - IDs das unidades associadas ao novo usuário.
   *
   * @responseBody 201 - { status: true, message: string, data: any } - Retorna o status da criação e os dados do usuário criado.
   * @responseBody 400 - { status: false, message: string, data: {} } - Retorna erro ao criar o usuário.
   */
  public async criar({ request, response }: HttpContext): Promise<void> {
    const dados = await usuarioCreateValidator.validate(request.all())
    if (!dados.unidades || dados.unidades.length === 0) {
      let estabelecimentos
      try {
        if (dados.tipo === 1) {
          estabelecimentos = await this.estabelecimentoService.listarEstabelecimentos()
        } else if (dados.tipo === 2) {
          estabelecimentos = await this.estabelecimentoService.listarEstabelecimentos(['1', '2'])
        } else if (dados.tipo === 3) {
          estabelecimentos = await this.estabelecimentoService.listarEstabelecimentos(['3'])
        }
        if (estabelecimentos?.data && estabelecimentos.data.length > 0) {
          dados.unidades = estabelecimentos.data.map(
            (estabelecimento: { id: any }) => estabelecimento.id
          )
        } else {
          throw new Error('Nenhum estabelecimento encontrado para o tipo fornecido.')
        }
      } catch (error) {
        return response.status(400).send({
          status: false,
          message: `Erro ao buscar estabelecimentos: ${error.message}`,
        })
      }
    }
    const result = await this.usuarioService.criarUsuario(dados)
    return response.status(201).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }

  /**
   * @mostrar
   * @summary Exibe as informações de um usuário específico pelo ID.
   *
   * @operationId Mostrar
   * @tag Usuário
   *
   * @paramPath {number} id - ID do usuário.
   *
   * @responseBody 200 - { status: true, message: string, data: any } - Retorna os dados do usuário.
   * @responseBody 404 - { status: false, message: string, data: {} } - Retorna erro se o usuário não for encontrado.
   */
  public async mostrar({ params, response }: HttpContext): Promise<void> {
    const result = await this.usuarioService.mostrarUsuario(params.id)
    return response.status(200).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }

  /**
   * @atualizar
   * @summary Atualiza os dados de um usuário específico.
   *
   * @operationId Atualizar
   * @tag Usuário
   *
   * @paramPath {number} id - ID do usuário.
   * @paramBody {string} nome - Nome do usuário.
   * @paramBody {string} cpf - CPF do usuário.
   * @paramBody {string} senha - Senha do usuário.
   *
   * @responseBody 201 - { status: true, message: string, data: any } - Retorna o status da atualização e os dados atualizados.
   * @responseBody 404 - { status: false, message: string, data: {} } - Retorna erro se o usuário não for encontrado.
   */
  public async atualizar({ params, request, response }: HttpContext): Promise<void> {
    const payload = await usuarioUpdateValidator.validate(request.all(), {
      meta: { usuarioId: params.id },
    })
    const result = await this.usuarioService.atualizarUsuario(params.id, payload)
    return response.status(201).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }

  /**
   * @deletar
   * @summary Deleta um usuário pelo ID.
   *
   * @operationId Deletar
   * @tag Usuário
   *
   * @paramPath {number} id - ID do usuário a ser deletado.
   *
   * @responseBody 200 - { status: true, message: string, data: any } - Retorna o status da exclusão.
   * @responseBody 404 - { status: false, message: string, data: {} } - Retorna erro se o usuário não for encontrado.
   */
  public async deletar({ params, response }: HttpContext): Promise<void> {
    const result = await this.usuarioService.deletarUsuario(params.id)
    return response.status(200).send({
      status: true,
      message: result.message,
      data: result?.data,
    })
  }
}
