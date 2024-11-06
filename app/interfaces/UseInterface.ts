export interface Dados {
  id?: number // Identificador único dos dados (opcional)
  status?: boolean // Status do dado (opcional, pode indicar ativo/inativo)
  estabelecimento?: string // Nome do estabelecimento associado (opcional)
  cnpj?: string // CNPJ do estabelecimento (opcional)
  regiao?: number // ID da região associada (opcional)
  repasse?: boolean // Indica se há repasse (opcional)
  mensagem?: string // Mensagem associada a esses dados (opcional)
  saldo?: {
    quantidade: number // Quantidade disponível no saldo
    total: number // Total disponível
    tarifa: number // Tarifa aplicada
    saldo: number // Saldo restante
    transacoes: Transacao[] // Lista de transações associadas ao saldo
  }
}

export interface Pagamento {
  valor_pago: string // Valor pago
  valor_taxa_credenciado: string // Valor da taxa do credenciado
  data_quitacao: string // Data em que o pagamento foi quitado
  origem_pagamento: string // Origem do pagamento (ex: cartão, transferência)
}

export interface Recebimento {
  sacado_razao: string // Nome do sacado (quem recebe)
  valor_cobranca: number // Valor a ser cobrado
  pedido_numero: string // Número do pedido associado
  observacao: string // Observação sobre o recebimento
  tipo_cobranca: string // Tipo de cobrança (ex: fatura, boleto)
  data_documento: string // Data do documento relacionado ao recebimento
  data_vencimento: string // Data de vencimento do recebimento
  pagamentos: Pagamento[] // Lista de pagamentos relacionados a este recebimento
}

export interface Transacao {
  cliente: string // Nome do cliente associado à transação
  valor_boleto: number // Valor do boleto da transação
  pedido: string // Número do pedido associado
  observacao: string // Observação sobre a transação
  origem: string // Origem da transação (ex: online, presencial)
  forma_pagamento: string // Forma de pagamento utilizada (ex: cartão, dinheiro)
  data_documento: string // Data do documento relacionado à transação
  data_vencimento: string // Data de vencimento da transação
  data_pagamento: string // Data em que a transação foi paga
  total: number // Total da transação
  taxa: number // Taxa aplicada à transação
}
