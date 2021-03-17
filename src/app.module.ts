/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CategoryModule } from './category/category.module'
import { ProductModule } from './product/product.module'
import { BrandModule } from './brand/brand.module'
import { UserModule } from './user/user.module'
import { CoreModule } from './core/core.module'
import { graphqlUploadExpress } from 'graphql-upload'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: false,
        logging: true,
        // production ssl on heroku
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false
          }
        }
      })
    }),
    CoreModule,
    GraphQLModule.forRoot({
      uploads: false,
      cors: {
        origin: '*',
        credentials: true,
      },
      autoSchemaFile: 'schema.gql',
      context: ({ req, res }) => ({ req, res }),
    }),
    BrandModule,
    CategoryModule,
    UserModule,
    ProductModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(graphqlUploadExpress()).forRoutes('graphql')
  }
}
