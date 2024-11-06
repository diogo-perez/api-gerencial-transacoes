import Usuario from '#models/Usuario'
import hash from '@adonisjs/core/services/hash'
import { UsuarioInterface } from '../interfaces/UsuarioInterface.js'
import UnauthorizedException from '#exceptions/unauthorized_exception'
import NotFoundException from '#exceptions/notfound_exception'
import EstabelecimentoService from './EstabelecimentoService.js'

/**
 * Classe que fornece serviços para gerenciar usuários.
 */
export default class UsuarioService {
  private estabelecimentoService: EstabelecimentoService
  /**
   * Construtor da classe UsuarioService.
   * @param {EstabelecimentoService} estabelecimentoService - Serviço de Estabelecimento a ser injetado.
   */
  constructor() {
    this.estabelecimentoService = new EstabelecimentoService() // Instancie o serviço de Estabelecimento
  }
  /**
   * Autentica um usuário com base no CPF e senha.
   * @param {string} cpf - O CPF do usuário.
   * @param {string} senha - A senha do usuário.
   * @returns {Promise<{status: boolean, message: string, data: any}>} - Um objeto contendo o status da operação, uma mensagem e os dados do usuário autenticado.
   * @throws {UnauthorizedException} - Lança uma exceção se a senha for inválida.
   * @throws {NotFoundException} - Lança uma exceção se o usuário não for encontrado ou estiver inativo.
   * @throws {Error} - Lança um erro genérico se a autenticação falhar.
   */
  public async autenticar(
    cpf: string,
    senha: string
  ): Promise<{ status: boolean; message: string; data: any }> {
    try {
      const user = await Usuario.findByOrFail('cpf', cpf)

      if (!user) {
        throw new NotFoundException('Usuário não encontrado', {
          code: 'E_ROW_NOT_FOUND',
          status: 404,
        })
      }
      if (!user.status) {
        throw new NotFoundException('Usuário não encontrado', {
          code: 'E_ROW_NOT_FOUND',
          status: 404,
        })
      }
      const isValidPassword = await hash.verify(user.senha, senha)

      if (!isValidPassword)
        throw new UnauthorizedException('Senha inválida', { code: 'UNAUTHORIZED', status: 401 })

      const token = await Usuario.accessTokens.create(user)

      const result = await this.estabelecimentoService.listarEstabelecimentos()

      if (!result.status) {
        throw new Error('Erro ao buscar informações das unidades')
      }

      const unidadesUsuario = result.data
        .filter(
          (unidade: any) =>
            user.unidades?.includes(Number(unidade.id)) ||
            user.unidades == null ||
            (user.unidades?.length === 0 && unidade.tipo === 1)
        )
        .map((unidade: any) => ({
          id: unidade.id,
          nome: unidade.nome,
          tipo: unidade.tipo,
          regiao: unidade.regiao,
        }))

      return {
        status: true,
        message: `Usuário autenticado com sucesso`,
        data: {
          id: user.id,
          nome: user.nome,
          tipo: user.tipo,
          token: token.value!.release(),
          unidades: unidadesUsuario,
        },
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  /**
   * Lista todos os usuários.
   * @returns {Promise<{status: boolean, message: string, data: any}>} - Um objeto contendo o status da operação, uma mensagem e os dados dos usuários.
   * @throws {Error} - Lança um erro se a busca falhar.
   */
  public async listarUsuarios(): Promise<{ status: boolean; message: string; data: any }> {
    try {
      const info = await Usuario.all()

      return {
        status: true,
        message: `${info.length} registro(s) encontrado(s)`,
        data: info,
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  /**
   * Cria um novo usuário.
   * @param {UsuarioInterface} dados - Os dados do usuário a ser criado.
   * @returns {Promise<{status: boolean, message: string, data: any}>} - Um objeto contendo o status da operação, uma mensagem e os dados do usuário criado.
   * @throws {Error} - Lança um erro se a criação falhar.
   */
  public async criarUsuario(
    dados: UsuarioInterface
  ): Promise<{ status: boolean; message: string; data: any }> {
    try {
      const info = await Usuario.create(dados)
      return {
        status: true,
        message: 'Registro cadastrado com sucesso',
        data: info.toJSON(),
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  /**
   * Mostra os detalhes de um usuário pelo ID.
   * @param {number} id - O ID do usuário a ser mostrado.
   * @returns {Promise<{status: boolean, message: string, data: any}>} - Um objeto contendo o status da operação, uma mensagem e os dados do usuário encontrado.
   * @throws {Error} - Lança um erro se o usuário não for encontrado.
   */
  public async mostrarUsuario(
    id: number
  ): Promise<{ status: boolean; message: string; data: any }> {
    try {
      const info = Usuario.findOrFail(id)
      return {
        status: true,
        message: `Registro encontrado`,
        data: (await info).toJSON(),
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  /**
   * Atualiza os dados de um usuário.
   * @param {number} id - O ID do usuário a ser atualizado.
   * @param {UsuarioInterface} dados - Os novos dados do usuário.
   * @returns {Promise<{status: boolean, message: string, data: any}>} - Um objeto contendo o status da operação, uma mensagem e os dados do usuário atualizado.
   * @throws {Error} - Lança um erro se o usuário não for encontrado ou a atualização falhar.
   */
  public async atualizarUsuario(
    id: number,
    dados: UsuarioInterface
  ): Promise<{ status: boolean; message: string; data: any }> {
    try {
      const usuario = await Usuario.findOrFail(id)
      usuario.merge(dados)
      await usuario.save()
      return {
        status: true,
        message: 'Registro atualizado com sucesso',
        data: usuario.toJSON(),
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  /**
   * Deleta um usuário pelo ID.
   * @param {number} id - O ID do usuário a ser deletado.
   * @returns {Promise<{status: boolean, message: string, data: null}>} - Um objeto contendo o status da operação, uma mensagem e dados nulos após a exclusão.
   * @throws {Error} - Lança um erro se o usuário não for encontrado ou a exclusão falhar.
   */
  public async deletarUsuario(
    id: number
  ): Promise<{ status: boolean; message: string; data: null }> {
    try {
      const usuario = await Usuario.findOrFail(id)
      await usuario.delete()
      return {
        status: true,
        message: `Registro excluído com sucesso`,
        data: null,
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }
}
