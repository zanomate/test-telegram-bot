import { getUsers } from './queries.js'
import { sendMessage } from './telegram.js'

export const notifyUsers = async () => {
  const users = await getUsers()

  const currentTime = new Date().toLocaleTimeString()

  users.forEach((user) => {
    sendMessage(user.id, `L'ora corrente è: ${currentTime}`)
  })
}
