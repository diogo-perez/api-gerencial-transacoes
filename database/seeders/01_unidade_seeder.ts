import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Estabelecimento from '#models/Estabelecimento'

export default class extends BaseSeeder {
  async run() {
    // Inserir dados na tabela "unidades"
    await Estabelecimento.createMany([
      {
        nome: 'DOURADOS',
        cnpj: '00122815000143',
        repasse: true,
        tipo: 3,
        chave: 'chave123',
        identificador: 'iden123',
        seller: '',
        regiao: 1,
      },
      {
        nome: 'DOURADOS',
        cnpj: '00122815000143',
        repasse: false,
        tipo: 1,
        chave: 'chave123',
        identificador: 'iden123',
        seller: 'seller123',
        regiao: 1,
      },
      {
        nome: 'PONTA PORA',
        cnpj: '73737678001792',
        repasse: true,
        tipo: 3,
        chave: 'chave123',
        identificador: 'iden123',
        seller: '',
        regiao: 1,
      },
    ])
  }
}
