export interface UsuarioInterface {
  id?: number // Identificador único do usuário (opcional)
  nome?: string // Nome completo do usuário (opcional)
  cpf?: string // CPF do usuário (opcional)
  senha?: string // Senha do usuário (opcional)
  tipo?: number // Tipo de usuário (opcional, pode ser usado para definir permissões)
  status?: boolean // Status do usuário (opcional, indica se o usuário está ativo ou inativo)
  unidades?: number[] | null // IDs das unidades associadas ao usuário (opcional, pode ser nulo)
}
