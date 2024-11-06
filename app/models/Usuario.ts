import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

// Configuração do AuthFinder para permitir a autenticação por CPF e senha
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['cpf'], // Identificadores únicos para autenticação
  passwordColumnName: 'senha', // Nome da coluna que contém a senha
})

/**
 * Modelo que representa um Usuário no banco de dados.
 * Herda de BaseModel e implementa funcionalidades de autenticação.
 */
export default class Usuario extends compose(BaseModel, AuthFinder) {
  // Define o nome da tabela correspondente no banco de dados
  static table = 'usuario'

  /**
   * ID do usuário. Chave primária da tabela.
   */
  @column({ isPrimary: true })
  declare id: number

  /**
   * Nome do usuário.
   */
  @column()
  declare nome: string

  /**
   * CPF do usuário.
   */
  @column()
  declare cpf: string

  /**
   * Senha do usuário. Armazenada de forma segura.
   */
  @column()
  declare senha: string

  /**
   * Tipo de usuário, representado por um número.
   */
  @column()
  declare tipo: number

  /**
   * Status do usuário (ativo/inativo).
   */
  @column()
  declare status: boolean

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

  /**
   * Unidades associadas ao usuário. Pode ser um array de números, nulo ou indefinido.
   */
  @column()
  declare unidades: number[] | null | undefined

  /**
   * Provedor de tokens de acesso associado ao modelo de Usuário.
   */
  static accessTokens = DbAccessTokensProvider.forModel(Usuario, {
    expiresIn: '50 mins',
  })
}
