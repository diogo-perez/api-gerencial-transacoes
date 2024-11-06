/**
 * Formata uma string removendo acentos e convertendo para maiúsculas.
 * @param value - Valor a ser formatado. Se não for uma string, retorna uma string vazia.
 * @returns A string formatada em maiúsculas sem acentos.
 */
export const formatString = (value: any): string => {
  if (typeof value !== 'string') return ''
  return value
    .normalize('NFD') // Normaliza a string para decompor caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remove os diacríticos (acentos)
    .toUpperCase() // Converte para maiúsculas
}

/**
 * Formata um número, removendo todos os caracteres não numéricos.
 * @param value - Valor a ser formatado. Se for nulo ou indefinido, retorna uma string vazia.
 * @returns A string formatada contendo apenas números.
 */
export const formatarNumero = (value: string | null | undefined): string => {
  if (!value || typeof value !== 'string') return ''
  return value.replace(/\D/g, '') // Remove todos os caracteres que não são dígitos
}

/**
 * Formata uma data no formato 'dd/mm/aaaa' para 'aaaa-mm-dd'.
 * @param data - Data a ser formatada. Se for nula ou indefinida, retorna uma string vazia.
 * @returns A data formatada ou uma string vazia se o formato for inválido.
 */
export const formatarData = (data: string | null | undefined): string => {
  if (!data || typeof data !== 'string') return ''

  const partes = data.split('/') // Divide a data em partes
  if (partes.length !== 3) return '' // Verifica se há exatamente 3 partes

  const [dia, mes, ano] = partes // Desestrutura as partes
  return `${ano}-${mes}-${dia}` // Retorna a data formatada
}

/**
 * Valida se a data está no formato 'aaaa-mm-dd'.
 * @param data - Data a ser validada. Se for nula, retorna falso.
 * @returns Verdadeiro se a data estiver no formato correto, falso caso contrário.
 */
export const isValidaFormatoData = (data: string | null | undefined): boolean => {
  if (!data) {
    return false
  }
  const regex = /^\d{4}-\d{2}-\d{2}$/ // Regex para validar o formato de data
  return regex.test(data) // Retorna verdadeiro ou falso
}
