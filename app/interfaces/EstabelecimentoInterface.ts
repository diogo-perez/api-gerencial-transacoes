export interface EstabelecimentoInterface {
  id?: number // Identificador único do estabelecimento (opcional)
  nome?: string // Nome do estabelecimento (opcional)
  cnpj?: string // CNPJ do estabelecimento (opcional)
  repasse?: boolean // Indica se possui repasse ou não (opcional)
  tipo?: number // Tipo do estabelecimento (opcional)
  chave?: string // Chave de identificação (opcional) (USE) (MESH)
  identificador?: string // Identificador do estabelecimento (opcional)(USE) (MESH)
  seller?: string // Identificador do vendedor associado (opcional) (Mesh)
  regiao?: number // Código da região do estabelecimento (opcional)
}
