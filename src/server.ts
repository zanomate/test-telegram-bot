import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { notifyUsers } from './core/logics.js'
import { addNewUser, getUser, removeUser } from './core/queries.js'
import {
  deleteMessage,
  initBot,
  sendMessage,
  setKeyboardButtons,
  TelegramCommand,
  TelegramMessage,
} from './core/telegram.js'

const app = express()
const port = 3000
app.use(bodyParser.json())

app.post('/webhook', async (req: Request, res: Response) => {
  const { message } = req.body as TelegramMessage

  if (message && message.text) {
    const chatId = message.chat.id
    const message_id = message.message_id
    const text = message.text

    console.log(chatId, JSON.stringify(message))

    if (text === TelegramCommand.START) {
      await setKeyboardButtons(chatId)
    }

    if (text === TelegramCommand.SUB) {
      const user = await getUser(chatId)

      if (user === null) {
        await addNewUser(chatId)
        await sendMessage(chatId, 'Sei iscritto alle notifiche! Riceverai un messaggio ogni minuto.')
      } else {
        await sendMessage(chatId, 'Sei già iscritto alle notifiche.')
      }
    }

    if (text === TelegramCommand.UNSUB) {
      await removeUser(chatId)
      await sendMessage(chatId, `Ti sei disiscritto dalle notifiche.`)
    }

    if (!Object.values(TelegramCommand).includes(text as TelegramCommand)) {
      await deleteMessage(chatId, message_id)
    }
  }

  res.sendStatus(200)
})

app.listen(port, async () => {
  console.log(`Server in ascolto sulla porta ${port}`)

  await initBot()

  setInterval(notifyUsers, 60 * 1000)
})
