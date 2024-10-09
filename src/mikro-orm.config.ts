import { defineConfig } from '@mikro-orm/sqlite'
import { User } from './entities/User.entity.js'

export default defineConfig({
  entities: [User],
  dbName: 'my-db',
})
