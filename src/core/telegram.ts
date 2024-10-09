import axios from 'axios'

export interface TelegramMessage {
  message: {
    message_id: number
    chat: {
      id: number
    }
    text: string
  }
}

export enum TelegramCommand {
  START = '/start',
  SUB = '/sub',
  UNSUB = '/unsub',
}

const ENDPOINT = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`
const WEBHOOK_URL = `${process.env.WEBSERVER_ENDPOINT}/webhook`

const tryFetch = async <Res>(fetchFn: () => Promise<Res>): Promise<Res | null> => {
  try {
    return await fetchFn()
  } catch (error) {
    // @ts-ignore
    console.error('Errore nella richiesta:', error?.message)
    return null
  }
}

const setWebhook = async () => {
  return await tryFetch(() =>
    axios.post(`${ENDPOINT}/setWebhook`, {
      url: WEBHOOK_URL,
    }),
  )
}

const setMyCommands = async () => {
  return await tryFetch(() =>
    axios.post(`${ENDPOINT}/setMyCommands`, {
      commands: [
        { command: 'sub', description: 'Iscriviti alle notifiche' },
        { command: 'unsub', description: 'Disiscriviti dalle notifiche' },
      ],
    }),
  )
}

const setChatMenuButton = async () => {
  return await tryFetch(() =>
    axios.post(`${ENDPOINT}/setChatMenuButton`, {
      menu_button: {
        type: 'web_app',
        text: 'Apri il sito web',
        web_app: { url: 'https://matteozanoncello.dev' },
      },
    }),
  )
}

export const sendMessage = async (chatId: number, text: string, params: object = {}) => {
  return await tryFetch(() =>
    axios.post(`${ENDPOINT}/sendMessage`, {
      chat_id: chatId,
      text: text,
      ...params,
    }),
  )
}

export const deleteMessage = async (chat_id: number, message_id: number) => {
  return await tryFetch(() =>
    axios.post(`${ENDPOINT}/deleteMessage`, {
      chat_id,
      message_id,
    }),
  )
}

export const setKeyboardButtons = async (chatId: number) => {
  return await sendMessage(chatId, 'Benvenuto!', {
    reply_markup: {
      keyboard: [
        [{ text: '/sub' }, { text: '/unsub' }],
        [{ text: 'Sito Web', web_app: { url: 'https://matteozanoncello.dev' } }],
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  })
}

export const initBot = async () => {
  await setWebhook()
  await setMyCommands()
  await setChatMenuButton()
}
