import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'terminal'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('serial', 150).notNullable().unique()
      table.string('descricao', 255).nullable()
      table.integer('tipo').unsigned().notNullable()
      table.string('identificador', 255).notNullable()
      table.integer('unidade_id').unsigned().notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
