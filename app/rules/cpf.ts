import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'
import { validaCpf } from '../utils/valida_documento.js'

/**
 * Options accepted by the unique rule
 */
type Options = {}

/**
 * Função de validação para o CPF.
 * @param value - O valor a ser validado como CPF.
 * @param _options - Opções adicionais (não utilizadas nesta implementação).
 * @param field - O contexto do campo que contém informações sobre a validação.
 * @returns Se o valor não for uma string, a função retorna sem fazer nada.
 * Se o CPF não for válido, um erro será reportado para o contexto do campo.
 */
async function cpf(value: unknown, _options: Options, field: FieldContext) {
  /**
   * Não queremos lidar com valores que não são strings.
   * A regra "string" lidará com a validação.
   */
  if (typeof value !== 'string') {
    return
  }

  const valida = validaCpf(value) // Chama a função para validar o CPF

  if (!valida) {
    field.report('O {{field}} não é válido', 'cpf', field) // Reporta erro se o CPF for inválido
  }
}

/**
 * Convertendo a função para uma regra do VineJS.
 */
export const cpfRule = vine.createRule(cpf) // Cria a regra de validação
