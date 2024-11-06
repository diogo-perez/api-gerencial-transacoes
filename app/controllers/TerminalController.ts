import { HttpContext } from '@adonisjs/core/http'
import TerminalService from '#services/TerminalService'
import { TerminalInterface } from '../interfaces/TerminalInterface.js'
import { terminalCreateValidator, terminalUpdateValidator } from '#validators/TerminalValidator'
import Estabelecimento from '#models/Estabelecimento'
import ApiService from '../utils/api.js'
import NotFoundException from '#exceptions/notfound_exception'

/**
 * TerminalController - Controlador para gerenciar terminais (maquininha de cartão).
 */
export default class TerminalController {
  private terminalService = new TerminalService()

  /**
   * @index
   * @summary Listagem de todos os terminais
   *
   * @operationId ListarTerminais
   * @tag Terminais
   *
   * @responseBody 200 - {status: true, message: "Terminais listados com sucesso", data: [<Terminal>]}
   * @responseBody 400 - {status: false, message: "Falha ao processar requisição!", data: {}}
   * @responseBody 401 - {status: false, message: "Usuário não autenticado!", data: {}}
   * @responseBody 403 - {status: false, message: "Usuário não possui permissão de acesso ao recurso!", data: {}}
   * @responseBody 500 - {status: false, message: "Falha interna do servidor! Contate o suporte.", data: {}}
   */
  public async listar({ response }: HttpContext): Promise<void> {
    const result = await this.terminalService.listarTerminais()

    return response.status(200).send({
      status: true,
      message: result.message,
      data: result.data,
    })
  }

  /**
   * @create
   * @summary Criação de um novo terminal
   *
   * @operationId CriarTerminal
   * @tag Terminais
   *
   * @requestBody { serial: string, descricao: string, tipo: integer, unidade_id: integer }
   *
   * @responseBody 201 - {status: true, message: "Terminal criado com sucesso", data: <Terminal>}
   * @responseBody 400 - {status: false, message: "Falha ao processar requisição!", data: {}}
   * @responseBody 404 - {status: false, message: "Terminal não encontrado", data: {}}
   * @responseBody 500 - {status: false, message: "Falha interna do servidor! Contate o suporte.", data: {}}
   */
  public async criar({ request, response }: HttpContext): Promise<void> {
    const dados = await terminalCreateValidator.validate(
      request.only(['serial', 'descricao', 'tipo', 'unidade_id'])
    )

    try {
      const estabelecimento = await Estabelecimento.query()
        .where('id', dados.unidade_id)
        .firstOrFail()
      const options = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.zoop.ws/v1/card-present/terminals/search?serial_number=${dados.serial}`,
        headers: {
          accept: 'application/json',
          authorization: 'Basic ' + estabelecimento.chave,
        },
      }

      const result: any = await ApiService.apiRequest(options)

      if (result.length <= 0)
        throw new NotFoundException('Terminal não encontrado', {
          code: 'E_ROW_NOT_FOUND',
          status: 404,
        })

      const terminal = await this.terminalService.criarTerminal({
        serial: result.serial_number,
        descricao: dados.descricao,
        tipo: dados.tipo,
        identificador: result.id,
        unidade_id: dados.unidade_id,
      })
      return response.status(201).send({
        status: true,
        message: result?.message,
        data: terminal,
      })
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  /**
   * @show
   * @summary Detalhes de um terminal específico
   *
   * @operationId MostrarTerminal
   * @tag Terminais
   *
   * @paramPath id - O ID do terminal - @type(integer)
   *
   * @responseBody 200 - {status: true, message: "Terminal encontrado", data: <Terminal>}
   * @responseBody 400 - {status: false, message: "Falha ao processar requisição!", data: {}}
   * @responseBody 404 - {status: false, message: "Terminal não encontrado", data: {}}
   * @responseBody 500 - {status: false, message: "Falha interna do servidor! Contate o suporte.", data: {}}
   */
  public async mostrar({
    params,
  }: HttpContext): Promise<{ status: boolean; message: string; data: any }> {
    const result = await this.terminalService.mostrarTerminal(params.id)

    return {
      status: true,
      message: result.message,
      data: result.data,
    }
  }

  /**
   * @update
   * @summary Atualização das informações de um terminal
   *
   * @operationId AtualizarTerminal
   * @tag Terminais
   *
   * @paramPath id - O ID do terminal - @type(integer)
   * @requestBody { serial: string, descricao: string, tipo: integer }
   *
   * @responseBody 200 - {status: true, message: "Terminal atualizado com sucesso", data: <Terminal>}
   * @responseBody 400 - {status: false, message: "Falha ao processar requisição!", data: {}}
   * @responseBody 404 - {status: false, message: "Terminal não encontrado", data: {}}
   * @responseBody 500 - {status: false, message: "Falha interna do servidor! Contate o suporte.", data: {}}
   */
  public async atualizar({ params, request, response }: HttpContext): Promise<void> {
    const dados: TerminalInterface = await terminalUpdateValidator.validate(
      request.only(['serial', 'descricao', 'tipo'])
    )

    const result = await this.terminalService.atualizarTerminal(params.id, dados)

    return response.status(200).send({
      status: true,
      message: result.message,
      data: result.data,
    })
  }

  /**
   * @delete
   * @summary Remoção de um terminal
   *
   * @operationId DeletarTerminal
   * @tag Terminais
   *
   * @paramPath id - O ID do terminal - @type(integer)
   *
   * @responseBody 200 - {status: true, message: "Terminal deletado com sucesso", data: <Terminal>}
   * @responseBody 400 - {status: false, message: "Falha ao processar requisição!", data: {}}
   * @responseBody 404 - {status: false, message: "Terminal não encontrado", data: {}}
   * @responseBody 500 - {status: false, message: "Falha interna do servidor! Contate o suporte.", data: {}}
   */
  public async deletar({ params, response }: HttpContext): Promise<void> {
    const result = await this.terminalService.deletarTerminal(params.id)

    return response.status(200).send({
      status: true,
      message: result.message,
      data: result?.data,
    })
  }
}
