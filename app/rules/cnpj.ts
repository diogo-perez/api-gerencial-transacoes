import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'
import { validaCnpj } from '../utils/valida_documento.js'

/**
 * Options accepted by the unique rule
 */
type Options = {}

/**
 * Função de validação para o CNPJ.
 * @param value - O valor a ser validado como CNPJ.
 * @param _options - Opções adicionais (não utilizadas nesta implementação).
 * @param field - O contexto do campo que contém informações sobre a validação.
 * @returns Se o valor não for uma string, a função retorna sem fazer nada.
 * Se o CNPJ não for válido, um erro será reportado para o contexto do campo.
 */
async function cnpj(value: unknown, _options: Options, field: FieldContext) {
  /**
   * Não queremos lidar com valores que não são strings.
   * A regra "string" lidará com a validação.
   */
  if (typeof value !== 'string') {
    return
  }

  // Descomentar a verificação abaixo se desejar validar o formato do CNPJ
  // if (value.length !== 18) {
  //   field.report('O {{field}} deve estar no formato 00.000.000/0000-00', 'cpf', field)
  // }

  const valida = validaCnpj(value) // Chama a função para validar o CNPJ

  if (!valida) {
    field.report('O {{field}} não é válido', 'cnpj', field) // Reporta erro se o CNPJ for inválido
  }
}

/**
 * Convertendo a função para uma regra do VineJS.
 */
export const cnpjRule = vine.createRule(cnpj) // Cria a regra de validação
