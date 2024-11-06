import Estabelecimento from '#models/Estabelecimento'
import { EstabelecimentoInterface } from '../interfaces/EstabelecimentoInterface.js'

/**
 * Classe que fornece serviços para gerenciar estabelecimentos.
 */
export default class EstabelecimentoService {
  /**
   * Lista todos os estabelecimentos.
   * @returns {Promise<{status: boolean, message: string, data: any}>} - Um objeto contendo o status da operação, uma mensagem e os dados dos estabelecimentos.
   * @throws {Error} - Lança um erro se a busca falhar.
   */
  public async listarEstabelecimentos(
    tipos?: string[],
    ids?: number[]
  ): Promise<{ status: boolean; message: string; data: any }> {
    try {
      let query = Estabelecimento.query()

      // Se os tipos forem informados, filtrar pelos tipos
      if (tipos && tipos.length > 0) {
        query = query.whereIn('tipo', tipos)
      }

      // Se o array de ids for informado, filtrar pelos ids
      if (ids && ids.length > 0) {
        query = query.whereIn('id', ids)
      }

      const info = await query.exec()

      return {
        status: true,
        message: `Busca realizada com sucesso!`,
        data: info,
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  /**
   * Cria um novo estabelecimento.
   * @param {EstabelecimentoInterface} dados - Os dados do estabelecimento a ser criado.
   * @returns {Promise<{status: boolean, message: string, data: any}>} - Um objeto contendo o status da operação, uma mensagem e os dados do estabelecimento criado.
   * @throws {Error} - Lança um erro se a criação falhar.
   */
  public async criarEstabelecimento(
    dados: EstabelecimentoInterface
  ): Promise<{ status: boolean; message: string; data: any }> {
    try {
      const info = await Estabelecimento.create(dados)
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
   * Mostra os detalhes de um estabelecimento pelo ID.
   * @param {number} id - O ID do estabelecimento a ser mostrado.
   * @returns {Promise<{status: boolean, message: string, data: any}>} - Um objeto contendo o status da operação, uma mensagem e os dados do estabelecimento encontrado.
   * @throws {Error} - Lança um erro se o estabelecimento não for encontrado.
   */
  public async mostrarEstabelecimento(
    id: number
  ): Promise<{ status: boolean; message: string; data: any }> {
    try {
      const info = Estabelecimento.findOrFail(id)
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
   * Atualiza os dados de um estabelecimento.
   * @param {number} id - O ID do estabelecimento a ser atualizado.
   * @param {EstabelecimentoInterface} dados - Os novos dados do estabelecimento.
   * @returns {Promise<{status: boolean, message: string, data: any}>} - Um objeto contendo o status da operação, uma mensagem e os dados do estabelecimento atualizado.
   * @throws {Error} - Lança um erro se o estabelecimento não for encontrado ou a atualização falhar.
   */
  public async atualizarEstabelecimento(
    id: number,
    dados: EstabelecimentoInterface
  ): Promise<{ status: boolean; message: string; data: any }> {
    try {
      const estabelecimento = await Estabelecimento.findOrFail(id)
      if (dados.tipo == 3) {
        dados.seller = ''
      }
      estabelecimento.merge(dados)
      await estabelecimento.save()
      return {
        status: true,
        message: `Registro atualizado com sucesso`,
        data: estabelecimento,
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  /**
   * Deleta um estabelecimento pelo ID.
   * @param {number} id - O ID do estabelecimento a ser deletado.
   * @returns {Promise<{status: boolean, message: string, data: null}>} - Um objeto contendo o status da operação, uma mensagem e dados nulos após a exclusão.
   * @throws {Error} - Lança um erro se o estabelecimento não for encontrado ou a exclusão falhar.
   */
  public async deletarEstabelecimento(id: number) {
    try {
      const estabelecimento = await Estabelecimento.findOrFail(id)
      await estabelecimento.delete()
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
