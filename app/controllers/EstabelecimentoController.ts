import { HttpContext } from '@adonisjs/core/http'
import EstabelecimentoService from '#services/EstabelecimentoService'
import {
  unidadeCreateValidator,
  unidadeUpdateValidator,
} from '#validators/EstabelecimentoValidator'

/**
 * EstabelecimentoController - Controlador para gerenciar estabelecimentos.
 */
export default class EstabelecimentoController {
  private estabelecimentoService = new EstabelecimentoService()

  /**
   * @index
   * @summary Lista todos os estabelecimentos
   *
   * @operationId ListarEstabelecimentos
   * @tag Estabelecimento
   *
   * @paramQuery tipo - Tipo do estabelecimento - @type(integer)
   * @paramQuery ids - IDs dos estabelecimentos - @type(array)
   *
   * @responseBody 200 - <ResponseAll> - Lista de todos os estabelecimentos.
   * @responseBody 500 - {status: false, message: "Falha interna do servidor! Contate o suporte.", data: {}}
   */
  public async listar({ request, response }: HttpContext): Promise<void> {
    const { tipo, ids } = request.qs()
    const result = await this.estabelecimentoService.listarEstabelecimentos(tipo, ids)

    response.status(200).send({
      status: true,
      message: result.message,
      data: result.data,
    })
  }

  /**
   * @create
   * @summary Cria um novo estabelecimento
   *
   * @operationId CriarEstabelecimento
   * @tag Estabelecimento
   *
   * @paramBody tipo - Tipo do estabelecimento - @type(integer)
   * @paramBody identificador - Identificador do estabelecimento - @type(string)
   * @paramBody nome - Nome do estabelecimento - @type(string)
   * @paramBody cnpj - CNPJ do estabelecimento - @type(string)
   * @paramBody seller - Vendedor associado - @type(string)
   * @paramBody regiao - Região do estabelecimento - @type(integer)
   * @paramBody repasse - Indica se há repasse - @type(boolean)
   *
   * @responseBody 201 - <ResponseSuccess> - Estabelecimento criado com sucesso.
   * @responseBody 400 - {status: false, message: "Falha ao processar requisição!", data: {}}
   * @responseBody 500 - {status: false, message: "Falha interna do servidor! Contate o suporte.", data: {}}
   */
  public async criar({ request, response }: HttpContext): Promise<void> {
    const { tipo, identificador } = request.only(['tipo', 'identificador'])
    const dados = await unidadeCreateValidator.validate(request.all(), {
      meta: { tipo: tipo, identificador: identificador },
    })

    const result = await this.estabelecimentoService.criarEstabelecimento(dados)

    return response.status(201).send({
      status: true,
      message: result?.message,
      data: result?.data,
    })
  }

  /**
   * @show
   * @summary Mostra os detalhes de um estabelecimento específico
   *
   * @operationId MostrarEstabelecimento
   * @tag Estabelecimento
   *
   * @paramPath id - ID do estabelecimento - @type(integer)
   *
   * @responseBody 200 - <ResponseSuccess> - Detalhes do estabelecimento.
   * @responseBody 404 - {status: false, message: "Estabelecimento não encontrado!", data: {}}
   * @responseBody 500 - {status: false, message: "Falha interna do servidor! Contate o suporte.", data: {}}
   */
  public async mostrar({
    params,
  }: HttpContext): Promise<{ status: boolean; message: string; data: any }> {
    const result = await this.estabelecimentoService.mostrarEstabelecimento(params.id)

    return {
      status: true,
      message: result.message,
      data: result.data,
    }
  }

  /**
   * @update
   * @summary Atualiza as informações de um estabelecimento
   *
   * @operationId AtualizarEstabelecimento
   * @tag Estabelecimento
   *
   * @paramPath id - ID do estabelecimento - @type(integer)
   * @paramBody nome - Nome do estabelecimento - @type(string)
   * @paramBody cnpj - CNPJ do estabelecimento - @type(string)
   * @paramBody repasse - Indica se há repasse - @type(boolean)
   * @paramBody tipo - Tipo do estabelecimento - @type(integer)
   * @paramBody chave - Chave do estabelecimento - @type(string)
   * @paramBody identificador - Identificador do estabelecimento - @type(string)
   * @paramBody seller - Vendedor associado - @type(string)
   * @paramBody regiao - Região do estabelecimento - @type(integer)
   *
   * @responseBody 200 - <ResponseSuccess> - Estabelecimento atualizado com sucesso.
   * @responseBody 400 - {status: false, message: "Falha ao processar requisição!", data: {}}
   * @responseBody 404 - {status: false, message: "Estabelecimento não encontrado!", data: {}}
   * @responseBody 500 - {status: false, message: "Falha interna do servidor! Contate o suporte.", data: {}}
   */
  public async atualizar({ params, request, response }: HttpContext): Promise<void> {
    const data = request.all()
    const dados = await unidadeUpdateValidator.validate(data, {
      meta: {
        unidadeId: params.id,
        tipo: data.tipo,
        identificador: data.identificador,
        id: params.id,
      },
    })

    const result = await this.estabelecimentoService.atualizarEstabelecimento(params.id, dados)

    return response.status(200).send({
      status: true,
      message: result.message,
      data: result.data,
    })
  }

  /**
   * @delete
   * @summary Deleta um estabelecimento
   *
   * @operationId DeletarEstabelecimento
   * @tag Estabelecimento
   *
   * @paramPath id - ID do estabelecimento - @type(integer)
   *
   * @responseBody 200 - <ResponseSuccess> - Estabelecimento deletado com sucesso.
   * @responseBody 404 - {status: false, message: "Estabelecimento não encontrado!", data: {}}
   * @responseBody 500 - {status: false, message: "Falha interna do servidor! Contate o suporte.", data: {}}
   */
  public async deletar({ params, response }: HttpContext): Promise<void> {
    const result = await this.estabelecimentoService.deletarEstabelecimento(params.id)

    return response.status(200).send({
      status: true,
      message: result.message,
      data: result?.data,
    })
  }
}
