import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const messages = new SimpleMessagesProvider({
  'required': 'O campo {{field}} é obrigatório',
  'string': 'O campo {{field}} deve ser do tipo string',
  'boolean': 'O campo {{field}} deve ser do tipo booleano',
  'number': 'O campo {{field}} deve ser do tipo número',
  'withoutDecimals': 'O campo {{field}} deve ser do tipo inteiro',
  'minLength': 'O campo {{field}} deve ter um tamanho mínimo de {{min}} caracteres',
  'maxLength': 'O campo {{field}} deve ter um tamanho máximo de {{max}} caracteres',
  'database.unique': 'Já existe um registro ativo com oª {{field}} informadoª',
  'database.exists': 'Não foi encontrado nenhuma referência ativa para o campo {{field}}',
  'array': 'O campo {{field}} deve ser um array',
  'fixedLength': 'O campo {{field}} deve ter um tamanho de {{size}} caracteres',
  'regex': 'O campo {{field}} informado está no formato inválido',
  'in': 'O valor do campo {{field}} deve ser um dos seguintes: {{values}}',
})

vine.messagesProvider = messages
