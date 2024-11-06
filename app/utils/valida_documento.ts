import { formatarNumero } from './format.js'

/**
 * Valida um CPF (Cadastro de Pessoas Físicas).
 * @param value - O CPF a ser validado.
 * @returns Verdadeiro se o CPF for válido, falso caso contrário.
 */
export const validaCpf = (value: string): boolean => {
  const cpfFormatado = formatarNumero(value) // Formata o CPF removendo caracteres não numéricos
  const invalidos = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
  ]

  // Verifica se o CPF está vazio, tem tamanho inválido ou é um CPF inválido
  if (!cpfFormatado || cpfFormatado.length !== 11 || invalidos.includes(cpfFormatado)) return false

  let soma = 0
  let resto: number

  // Cálculo do primeiro dígito verificador
  for (let i = 1; i <= 9; i++) soma += parseInt(cpfFormatado?.substring(i - 1, i)) * (11 - i)
  resto = (soma * 10) % 11

  if (resto === 10 || resto === 11) resto = 0 // Ajusta o resto
  if (resto !== parseInt(cpfFormatado?.substring(9, 10))) return false // Verifica o primeiro dígito

  soma = 0
  // Cálculo do segundo dígito verificador
  for (let i = 1; i <= 10; i++) soma += parseInt(cpfFormatado?.substring(i - 1, i)) * (12 - i)
  resto = (soma * 10) % 11

  if (resto === 10 || resto === 11) resto = 0 // Ajusta o resto
  if (resto !== parseInt(cpfFormatado?.substring(10, 11))) return false // Verifica o segundo dígito

  return true // CPF válido
}

/**
 * Valida um CNPJ (Cadastro Nacional da Pessoa Jurídica).
 * @param value - O CNPJ a ser validado.
 * @returns Verdadeiro se o CNPJ for válido, falso caso contrário.
 */
export const validaCnpj = (value: string): boolean => {
  const cnpjFormatado = formatarNumero(value) // Formata o CNPJ removendo caracteres não numéricos
  const invalidos = [
    '00000000000000',
    '11111111111111',
    '22222222222222',
    '33333333333333',
    '44444444444444',
    '55555555555555',
    '66666666666666',
    '77777777777777',
    '88888888888888',
    '99999999999999',
  ]

  // Verifica se o CNPJ tem 14 dígitos e não é um CNPJ inválido
  if (cnpjFormatado?.length === 14 && !invalidos.includes(cnpjFormatado)) {
    let tamanho = cnpjFormatado?.length - 2 // Tamanho do número sem os dígitos verificadores
    let numeros = cnpjFormatado?.substring(0, tamanho) // Números do CNPJ
    let digitos = cnpjFormatado?.substring(tamanho) // Dígitos verificadores
    let soma: number = 0
    let pos = tamanho - 7 // Posição inicial do cálculo

    // Cálculo do primeiro dígito verificador
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos-- // Soma ponderada
      if (pos < 2) pos = 9 // Reseta a posição
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11) // Cálculo do dígito
    if (resultado !== parseInt(digitos.charAt(0))) return false // Verifica o primeiro dígito

    // Cálculo do segundo dígito verificador
    tamanho = tamanho + 1 // Inclui o primeiro dígito
    numeros = cnpjFormatado?.substring(0, tamanho) // Atualiza números
    soma = 0
    pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos-- // Soma ponderada
      if (pos < 2) pos = 9 // Reseta a posição
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11) // Cálculo do dígito
    if (resultado !== parseInt(digitos.charAt(1))) return false // Verifica o segundo dígito

    return true // CNPJ válido
  } else {
    return false // CNPJ inválido
  }
}
