import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'estabelecimento'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nome', 255).notNullable()
      table.string('cnpj', 19).notNullable()
      table.boolean('repasse').notNullable()
      table.integer('tipo').unsigned().notNullable()
      table.string('chave', 255).notNullable()
      table.string('identificador', 255).notNullable()
      table.string('seller', 150).nullable()
      table.integer('regiao').unsigned().notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
