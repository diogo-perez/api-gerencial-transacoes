import Terminal from '#models/Terminal'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Inserir dados na tabela "terminals"
    await Terminal.createMany([
      {
        serial: '1234',
        descricao: 'ESCRITORIO',
        tipo: 1,
        unidade_id: 1,
        identificador: 'iden123',
      },
    ])
  }
}
