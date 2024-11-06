export interface TerminalInterface {
  id?: number // Identificador único do terminal (opcional)
  serial?: string // Número de série do terminal (opcional) (MAQUININHA DE CARTAO)
  descricao?: string | null // Descrição do terminal (opcional, pode ser nulo)
  tipo?: number // Tipo do terminal (opcional)
  unidade_id?: number // ID da unidade associada ao terminal (opcional)
  identificador?: string // Identificador do terminal (opcional) (MESH)
}
