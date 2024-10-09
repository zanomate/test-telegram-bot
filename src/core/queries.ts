import { User } from '../entities/User.entity.js'
import { em } from './orm.js'

export const addNewUser = async (chatId: number) => {
  const user = new User()
  user.id = chatId

  await em.persist(user).flush()
}

export const getUser = async (chatId: number) => {
  return await em.findOne(User, chatId)
}

export const getUsers = async () => {
  return await em.find(User, {})
}

export const removeUser = async (chatId: number) => {
  const user = em.getReference(User, chatId)
  return await em.remove(user).flush()
}
