import vine from '@vinejs/vine'
import { formatarNumero } from '../utils/format.js'
import { cpfRule } from '../rules/cpf.js'

/**
 * Validador para a criação de usuários.
 * Utiliza a biblioteca Vine para validações de formato e lógica.
 */
export const usuarioCreateValidator = vine.compile(
  vine.object({
    /**
     * Nome do usuário. Deve ter entre 3 e 255 caracteres.
     */
    nome: vine.string().minLength(3).maxLength(255),

    /**
     * Tipo de usuário. Deve ser um dos valores [1, 2, 3].
     * 1 - Administrador
     * 2 - Acesso somente a Mesh
     * 3 - Acesso somente a Use
     */
    tipo: vine.number().in([1, 2, 3]),

    /**
     * CPF do usuário. Deve ter entre 11 e 14 caracteres.
     * O CPF é validado com uma regra específica e deve ser único na base de dados.
     */
    cpf: vine
      .string()
      .use(cpfRule({}))
      .minLength(11)
      .maxLength(14)
      .unique(async (db, value) => {
        const user = await db.from('public.usuario').where('cpf', value.replace(/\D/g, '')).first()
        return !user
      })
      .transform((value) => {
        return formatarNumero(value)
      }),

    /**
     * Senha do usuário. Deve ter entre 6 e 255 caracteres.
     */
    senha: vine.string().minLength(6).maxLength(255),

    /**
     * Unidades associadas ao usuário. Pode ser um array de IDs de unidades.
     * Os IDs devem existir na tabela de estabelecimentos.
     */
    unidades: vine
      .array(
        vine.number().exists(async (db, value) => {
          const unidade = await db.from('public.estabelecimento').where('id', value).first()
          return unidade !== undefined
        })
      )
      .nullable()
      .optional(),
  })
)

/**
 * Validador para a atualização de usuários.
 * Utiliza a biblioteca Vine para validações de formato e lógica.
 */
export const usuarioUpdateValidator = vine.compile(
  vine.object({
    /**
     * Nome do usuário. Deve ter entre 3 e 255 caracteres.
     * Este campo é opcional.
     */
    nome: vine.string().minLength(3).maxLength(255).optional(),

    /**
     * Tipo de usuário. Deve ser um dos valores [1, 2, 3].
     * 1 - Administrador
     * 2 - Acesso somente a Mesh
     * 3 - Acesso somene a USE
     * Este campo é opcional.
     */
    tipo: vine.number().in([1, 2, 3]).optional(),

    /**
     * CPF do usuário. Deve ter entre 11 e 14 caracteres.
     * O CPF é validado com uma regra específica e deve ser único, exceto para o usuário atual.
     * Este campo é opcional.
     */
    cpf: vine
      .string()
      .minLength(11)
      .maxLength(14)
      .use(cpfRule({}))
      .unique(async (db, value, field) => {
        const user = await db
          .from('public.usuario')
          .where('cpf', value.replace(/\D/g, ''))
          .whereNot('id', field.meta.usuarioId)
          .first()
        return !user
      })
      .transform((value) => {
        return formatarNumero(value)
      })
      .optional(),

    /**
     * Senha do usuário. Deve ter entre 6 e 255 caracteres.
     * Este campo é opcional.
     */
    senha: vine.string().minLength(6).maxLength(255).optional(),

    /**
     * Status do usuário. Pode ser verdadeiro ou falso.
     * Este campo é opcional.
     */
    status: vine.boolean().optional(),

    /**
     * Unidades associadas ao usuário. Pode ser um array de IDs de unidades.
     * Os IDs devem existir na tabela de estabelecimentos.
     * Este campo é opcional.
     */
    unidades: vine
      .array(
        vine.number().exists(async (db, value) => {
          const query = db.from('public.estabelecimento').where('id', value)
          const unidade = await query.first()
          return unidade
        })
      )
      .optional(),
  })
)

/**
 * Validador para o login de usuários.
 * Utiliza a biblioteca Vine para validações de formato e lógica.
 */
export const usuarioLogin = vine.compile(
  vine.object({
    /**
     * CPF do usuário. Deve ter pelo menos 11 caracteres.
     * O CPF é validado com uma regra específica.
     */
    cpf: vine
      .string()
      .minLength(11)
      .use(cpfRule({}))
      .transform((value) => {
        return formatarNumero(value)
      }),

    /**
     * Senha do usuário. Deve ter pelo menos 6 caracteres.
     */
    senha: vine.string().minLength(6),
  })
)
