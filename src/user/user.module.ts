import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthToken } from './authtoken.entity'
import { User } from './user.entity'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'
import { UserEmailIsUnique } from './validations/UserEmailIsUnique'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([User, AuthToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET')
      })
    })
  ],
  providers: [UserService, UserResolver, UserEmailIsUnique]
})
export class UserModule {}
