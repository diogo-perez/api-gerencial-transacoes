import Usuario from '#models/Usuario'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Inserir dados na tabela "usuarios"
    await Usuario.createMany([
      {
        nome: 'Diogo Perez Areco',
        cpf: '05224778107',
        senha: '052247',
        tipo: 1,
      },
    ])
  }
}
