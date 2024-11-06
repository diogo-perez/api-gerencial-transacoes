import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

/**
 * Modelo que representa um Terminal no banco de dados.
 * Herda de BaseModel para utilizar as funcionalidades do ORM do AdonisJS.
 */
export default class Terminal extends BaseModel {
  // Define o nome da tabela correspondente no banco de dados
  static table = 'terminal'

  /**
   * ID do terminal. Chave primária da tabela.
   */
  @column({ isPrimary: true })
  declare id: number

  /**
   * Serial do terminal.
   */
  @column()
  declare serial: string

  /**
   * Descrição do terminal. Este campo pode ser nulo.
   */
  @column()
  declare descricao: string | null

  /**
   * Tipo do terminal, representado por um número.
   */
  @column()
  declare tipo: number

  /**
   * Identificador único do terminal.
   */
  @column()
  declare identificador: string

  /**
   * ID da unidade a que este terminal pertence.
   */
  @column()
  declare unidade_id: number

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
