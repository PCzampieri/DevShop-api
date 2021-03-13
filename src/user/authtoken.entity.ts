import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from './user.entity'

@Entity()
export class AuthToken {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => User, user => user.authTokens)
  user: User

  @Column({ type: 'timestamp' })
  createdAt: Date

  @Column({ type: 'timestamp' })
  lastUsedAt: Date

  @Column()
  active: boolean

  @Column()
  userAgent: string

  @BeforeInsert()
  setCreatedDate(): void {
    this.createdAt = new Date()
    this.lastUsedAt = new Date()
    this.active = true
  }
}
