import vine from '@vinejs/vine'

/**
 * Validador para a criação de terminais.
 * Utiliza a biblioteca Vine para validações de formato e lógica.
 */
export const terminalCreateValidator = vine.compile(
  vine.object({
    /**
     * Serial do terminal. Deve ter entre 3 e 255 caracteres. (Mesh)
     */
    serial: vine.string().minLength(3).maxLength(255),

    /**
     * Descrição do terminal. Deve ter entre 3 e 255 caracteres.
     */
    descricao: vine.string().minLength(3).maxLength(255),

    /**
     * Tipo do terminal. Deve ser um dos valores [1, 2].
     * 1 - Zoop
     * 2 - Sumcred
     */
    tipo: vine.number().in([1, 2]),

    /**
     * ID da unidade associada ao terminal.
     */
    unidade_id: vine.number(),
  })
)

/**
 * Validador para a atualização de terminais.
 * Utiliza a biblioteca Vine para validações de formato e lógica.
 */
export const terminalUpdateValidator = vine.compile(
  vine.object({
    /**
     * Serial do terminal. Deve ter entre 3 e 255 caracteres.
     * Este campo é opcional.
     */
    serial: vine.string().minLength(3).maxLength(255).optional(),

    /**
     * Descrição do terminal. Deve ter entre 3 e 255 caracteres.
     * Este campo é opcional.
     */
    descricao: vine.string().minLength(3).maxLength(255).optional(),

    /**
     * Tipo do terminal. Deve ser um dos valores [1, 2].
     * 1 - Zoop
     * 2 - Sumcred
     * Este campo é opcional.
     */
    tipo: vine.number().in([1, 2]).optional(),

    /**
     * ID da unidade associada ao terminal.
     * Este campo é opcional.
     */
    unidade_id: vine.number().optional(),
  })
)
