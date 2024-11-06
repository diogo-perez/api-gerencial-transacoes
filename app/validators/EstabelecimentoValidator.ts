import vine from '@vinejs/vine'
import { formatarNumero } from '../utils/format.js'
import { cnpjRule } from '../rules/cnpj.js'

/**
 * Validador para a criação de unidades.
 * Utiliza a biblioteca Vine para validações de formato e lógica.
 */
export const unidadeCreateValidator = vine.compile(
  vine.object({
    /**
     * Nome da unidade. Deve ter entre 3 e 255 caracteres.
     */
    nome: vine.string().minLength(3).maxLength(255),

    /**
     * CNPJ da unidade. Deve seguir o formato XX.XXX.XXX/XXXX-XX.
     * Verifica se o CNPJ é único e aplica regras de formatação.
     */
    cnpj: vine
      .string()
      .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/)
      .use(cnpjRule({}))
      .unique(async (db, value, field) => {
        const unidade = await db
          .from('public.estabelecimento')
          .where('cnpj', value.replace(/\D/g, ''))
          .andWhere('tipo', field.meta.tipo)
          .andWhere('identificador', field.meta.identificador)
          .first()
        return !unidade
      })
      .transform((value) => {
        return formatarNumero(value)
      }),

    /**
     * Indica se a unidade faz repasse (booleano).
     */
    repasse: vine.boolean(),

    /**
     * Tipo da unidade. Deve ser um dos valores [1, 2, 3].
     * 1 - Zoop
     * 2 - Sumcred
     * 3 - USE
     */
    tipo: vine.number().in([1, 2, 3]),

    /**
     * Chave associada à unidade. (USE)
     */
    chave: vine.string(),

    /**
     * Identificador único da unidade. (USE)
     */
    identificador: vine.string(),

    /**
     * Vendedor associado à unidade. Este campo é obrigatório
     * quando o tipo da unidade não é 3. (Mesh)
     */
    seller: vine.string().optional().requiredWhen('tipo', '!=', 3),

    /**
     * Região da unidade. Deve ser um dos valores [1, 2, 3, 4, 5, 6].
     */
    regiao: vine.number().in([1, 2, 3, 4, 5, 6]),
  })
)

/**
 * Validador para a atualização de unidades.
 * Utiliza a biblioteca Vine para validações de formato e lógica.
 */
export const unidadeUpdateValidator = vine.compile(
  vine.object({
    /**
     * Nome da unidade. Deve ter entre 3 e 255 caracteres e ser único,
     * exceto para o registro que está sendo atualizado.
     */
    nome: vine.string().minLength(3).maxLength(255),

    /**
     * CNPJ da unidade. Aplica regras de formatação e validação.
     * Este campo é opcional.
     */

    cnpj: vine
      .string()
      .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/)
      .use(cnpjRule({}))
      .unique(async (db, value, field) => {
        const unidade = await db
          .from('public.estabelecimento')
          .where('cnpj', value.replace(/\D/g, ''))
          .andWhere('tipo', field.meta.tipo)
          .whereNot('id', field.meta.unidadeId)
          .andWhere('identificador', field.meta.identificador)
          .first()
        return !unidade
      })
      .transform((value) => formatarNumero(value))
      .optional(),

    /**
     * Indica se a unidade faz repasse (booleano). Este campo é opcional.
     */
    repasse: vine.boolean().optional(),

    /**
     * Tipo da unidade. Deve ser um dos valores [1, 2, 3]. Este campo é opcional.
     */
    tipo: vine.number().in([1, 2, 3]).optional(),

    /**
     * Chave associada à unidade. Este campo é opcional. (USE)
     */
    chave: vine.string().optional(),

    /**
     * Identificador único da unidade. Este campo é opcional. (USE)
     */
    identificador: vine.string().optional(),

    /**
     * Vendedor associado à unidade. Este campo é obrigatório
     * quando o tipo da unidade não é 3. (Mesh)
     */
    seller: vine.string().optional().requiredWhen('tipo', '!=', 3),

    /**
     * Região da unidade. Deve ser um dos valores [1, 2, 3, 4, 5, 6]. Este campo é opcional.
     */
    regiao: vine.number().in([1, 2, 3, 4, 5, 6]).optional(),
  })
)
