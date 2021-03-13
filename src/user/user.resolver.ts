/* eslint-disable prettier/prettier */
import {
  Args,
  Context,
  GraphQLExecutionContext,
  Mutation,
  Query,
  Resolver
} from '@nestjs/graphql'
import { UserPublic } from './dto/user'
import { UserService } from './user.service'
import { UserCreateInput } from './dto/user-create.input'
import { UserPasswordUpdateInput } from './dto/user-password-update.input'
import { UserMapper } from './user.mapper'
import { UserUpdateInput } from './dto/user-update.input'
import { AuthToken } from './dto/auth'
import { JwtService } from '@nestjs/jwt'
import { AuthUserInput } from './dto/auth-user-input'
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/utils/jwt-auth.guard'
import { AuthUserId } from 'src/utils/jwt-user.decorator'
import { AuthSession } from './dto/auth-session'

@Resolver(of => UserPublic)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  @UseGuards(AuthGuard)
  @Query(returns => [UserPublic], { name: 'panelGetAllUsers' })
  async getAllUsers(): Promise<UserPublic[]> {
    return await this.userService.findAll()
  }

  @UseGuards(AuthGuard)
  @Query(returns => [AuthSession], { name: 'panelGetAllUserSessions' })
  async getAllUserSessions(@Args('id') id: string): Promise<AuthSession[]> {
    return await this.userService.findAllUserSessions(id)
  }

  @UseGuards(AuthGuard)
  @Query(returns => UserPublic, { name: 'panelGetUserById' })
  async getUserById(@Args('id') id: string): Promise<UserPublic> {
    return await this.userService.findById(id)
  }

  @UseGuards(AuthGuard)
  @Query(returns => UserPublic, { name: 'panelGetUserByEmail' })
  async getUserByEmail(@Args('email') email: string): Promise<UserPublic> {
    return await this.userService.findByEmail(email)
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => UserPublic, { name: 'panelCreateUser' })
  async createUser(
    @Args('input')
    input: UserCreateInput
  ): Promise<UserPublic> {
    return this.userService.create(UserMapper.toEntity(input))
  }

  @Mutation(returns => UserPublic, { name: 'generateUser' })
  async generateUser(
    @Args('input')
    input: UserCreateInput
  ): Promise<UserPublic> {
    return this.userService.generateUser(UserMapper.toEntity(input))
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => UserPublic, { name: 'panelUpdateUser' })
  async updateUser(
    @Args('input')
    input: UserUpdateInput
  ): Promise<UserPublic> {
    return this.userService.update(UserMapper.toUpdateEntity(input))
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => Boolean, { name: 'panelChangeUserPassword' })
  async changeUserPass(
    @Args('input')
    input: UserPasswordUpdateInput
  ): Promise<boolean> {
    return this.userService.changePassword(input.id, input.password)
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => Boolean, { name: 'panelDeleteUser' })
  async deleteUser(@Args('id') input: string): Promise<boolean> {
    return this.userService.delete(input)
  }

  @Mutation(returns => AuthToken, { name: 'auth' })
  async auth(
    @Context() context: GraphQLExecutionContext,
    @Args('input') input: AuthUserInput
  ): Promise<AuthToken> {
    const [user, refreshToken] = await this.userService.auth(
      input.email,
      input.password,
      context['req']['headers']['user-agent']
    )
    if (user) {
      const authToken = new AuthToken()
      authToken.refreshToken = this.jwtService.sign(
        {
          scope: ['refreshToken'],
          id: refreshToken.id
        },
        {
          expiresIn: '8 hours'
        }
      )
      authToken.accessToken = this.jwtService.sign(
        {
          scope: ['accessToken', user.role],
          id: user.id
        },
        {
          expiresIn: '1 hour'
        }
      )
      return authToken
    }
    throw new Error('Bad creditals')
  }

  @Mutation(returns => String, { name: 'accessToken' })
  async accessToken(
    @Args('refreshToken') refreshToken: string
  ): Promise<string> {
    const decoded = this.jwtService.verify(refreshToken)
    if (decoded && decoded.scope.indexOf('refreshToken') >= 0) {
      const authToken = await this.userService.getRefreshToken(decoded.id)

      const accessToken = this.jwtService.sign(
        {
          scope: ['accessToken', authToken.user.role],
          id: authToken.user.id
        },
        {
          expiresIn: '1 hour'
        }
      )
      return accessToken
    }
    return null
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => Boolean, { name: 'panelInvalidadeUserSession' })
  async invalidadeUserSession(@Args('id') input: string): Promise<boolean> {
    return this.userService.invalidateRefreshToken(input)
  }

  @UseGuards(AuthGuard)
  @Query(returns => UserPublic, { name: 'panelGetMe' })
  async getMe(@AuthUserId() id: string): Promise<UserPublic> {
    return await this.userService.findById(id)
  }
}
