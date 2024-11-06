import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

/**
 * Modelo que representa um Estabelecimento no banco de dados.
 * Herda de BaseModel para utilizar as funcionalidades do ORM do AdonisJS.
 */
export default class Estabelecimento extends BaseModel {
  // Define o nome da tabela correspondente no banco de dados
  static table = 'estabelecimento'

  /**
   * ID do estabelecimento. Chave primária da tabela.
   */
  @column({ isPrimary: true })
  declare id: number

  /**
   * Nome do estabelecimento.
   */
  @column()
  declare nome: string

  /**
   * CNPJ do estabelecimento.
   */
  @column()
  declare cnpj: string

  /**
   * Indica se o repasse é habilitado (true) ou não (false).
   */
  @column()
  declare repasse: boolean

  /**
   * Tipo do estabelecimento, representado por um número.
   */
  @column()
  declare tipo: number

  /**
   * Chave de identificação do estabelecimento.
   */
  @column()
  declare chave: string

  /**
   * Identificador único do estabelecimento.
   */
  @column()
  declare identificador: string

  /**
   * Nome do vendedor associado ao estabelecimento.
   */
  @column()
  declare seller: string

  /**
   * Região associada ao estabelecimento, representada por um número.
   */
  @column()
  declare regiao: number

  /**
   * Data de criação do registro. É preenchida automaticamente ao criar um novo registro.
   */
  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  /**
   * Data de atualização do registro. É preenchida automaticamente ao atualizar um registro.
   */
  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime
}
