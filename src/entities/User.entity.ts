import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class User {
  @PrimaryKey()
  id!: number

  @Property()
  setupCompleted: boolean = false

  @Property()
  blacklistedUsers: number[] = []

  @Property()
  blacklistedPreferences: string[] = []
}
