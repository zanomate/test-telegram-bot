import { MikroORM } from '@mikro-orm/sqlite'
import config from '../mikro-orm.config.js'

const orm = await MikroORM.init(config)
await orm.schema.refreshDatabase()

export const em = orm.em.fork()
