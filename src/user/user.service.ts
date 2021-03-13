/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AuthToken } from './authtoken.entity'
import { User } from './user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(AuthToken)
    private authTokenRepository: Repository<AuthToken>
  ) { }

  async findAll(): Promise<User[]> {
    return this.userRepository.find()
  }

  async findAllUserSessions(id: string): Promise<AuthToken[]> {
    return this.authTokenRepository.find({
      where: [{ user: id, active: true }]
    })
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findOne(id)
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: [{ email }] })
  }

  async create(input: User): Promise<User> {
    return this.userRepository.save(input)
  }

  async generateUser(input: User): Promise<User> {
    const user = new User()
    user.name = 'User Test'
    user.email = 'test@test.com'
    user.password = '123456'
    user.role = 'root'
    return this.userRepository.save(user)
  }

  async auth(
    email: string,
    password: string,
    userAgent: string
  ): Promise<[User, AuthToken]> {
    const user = await this.userRepository.findOne({ where: { email } })
    if (user && (await user.checkPassword(password))) {
      const authToken = new AuthToken()
      authToken.user = user
      authToken.userAgent = userAgent

      const token = await this.authTokenRepository.save(authToken)
      return [user, token]
    }
    return [null, null]
  }

  async getRefreshToken(id: string): Promise<AuthToken> {
    const refreshToken = await this.authTokenRepository.findOne(
      { id, active: true },
      {
        relations: ['user']
      }
    )
    refreshToken.lastUsedAt = new Date()
    await this.authTokenRepository.save(refreshToken)
    return refreshToken
  }

  async invalidateRefreshToken(id: string): Promise<boolean> {
    const refreshToken = await this.authTokenRepository.findOne(id)
    refreshToken.active = false
    await this.authTokenRepository.save(refreshToken)
    return true
  }

  async update(input: User): Promise<User> {
    const entity = await this.userRepository.findOne(input.id)
    entity.name = input.name
    entity.email = input.email
    entity.role = input.role
    await this.userRepository.save(entity)
    return input
  }

  async changePassword(id: string, newPassword: string): Promise<boolean> {
    const entity = await this.userRepository.findOne(id)
    entity.password = newPassword
    await this.userRepository.save(entity)
    return true
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.userRepository.delete(id)
      return true
    } catch (error) {
      return false
    }
  }
}
