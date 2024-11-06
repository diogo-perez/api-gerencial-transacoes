import Terminal from '#models/Terminal'
import { TerminalInterface } from '../interfaces/TerminalInterface.js'

/**
 * Classe que fornece serviços para gerenciar terminais.
 */
export default class TerminalService {
  /**
   * Lista todos os terminais.
   * @returns {Promise<{status: boolean, message: string, data: any}>} - Um objeto contendo o status da operação, uma mensagem e os dados dos terminais.
   * @throws {Error} - Lança um erro se a busca falhar.
   */
  public async listarTerminais(): Promise<{ status: boolean; message: string; data: any }> {
    try {
      const info = await Terminal.all()
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
   * Cria um novo terminal.
   * @param {TerminalInterface} dados - Os dados do terminal a ser criado.
   * @returns {Promise<{status: boolean, message: string, data: any}>} - Um objeto contendo o status da operação, uma mensagem e os dados do terminal criado.
   * @throws {Error} - Lança um erro se a criação falhar.
   */
  public async criarTerminal(
    dados: TerminalInterface
  ): Promise<{ status: boolean; message: string; data: any }> {
    try {
      const info = await Terminal.create(dados)
      return {
        status: true,
        message: 'Registro cadastrado com sucesso',
        data: info,
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  /**
   * Mostra os detalhes de um terminal pelo ID.
   * @param {number} id - O ID do terminal a ser mostrado.
   * @returns {Promise<{status: boolean, message: string, data: any}>} - Um objeto contendo o status da operação, uma mensagem e os dados do terminal encontrado.
   * @throws {Error} - Lança um erro se o terminal não for encontrado.
   */
  public async mostrarTerminal(
    id: number
  ): Promise<{ status: boolean; message: string; data: any }> {
    try {
      const info = Terminal.findOrFail(id)
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
   * Atualiza os dados de um terminal.
   * @param {number} id - O ID do terminal a ser atualizado.
   * @param {TerminalInterface} dados - Os novos dados do terminal.
   * @returns {Promise<{status: boolean, message: string, data: any}>} - Um objeto contendo o status da operação, uma mensagem e os dados do terminal atualizado.
   * @throws {Error} - Lança um erro se o terminal não for encontrado ou a atualização falhar.
   */
  public async atualizarTerminal(
    id: number,
    dados: TerminalInterface
  ): Promise<{ status: boolean; message: string; data: any }> {
    try {
      const terminal = await Terminal.findOrFail(id)
      terminal.merge(dados)
      await terminal.save()
      return {
        status: true,
        message: `Registro atualizado com sucesso`,
        data: terminal,
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  /**
   * Deleta um terminal pelo ID.
   * @param {number} id - O ID do terminal a ser deletado.
   * @returns {Promise<{status: boolean, message: string, data: null}>} - Um objeto contendo o status da operação, uma mensagem e dados nulos após a exclusão.
   * @throws {Error} - Lança um erro se o terminal não for encontrado ou a exclusão falhar.
   */
  public async deletarTerminal(
    id: number
  ): Promise<{ status: boolean; message: string; data: null }> {
    try {
      const terminal = await Terminal.findOrFail(id)
      await terminal.delete()
      return {
        status: true,
        message: `Terminal excluído com sucesso`,
        data: null,
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }
}
