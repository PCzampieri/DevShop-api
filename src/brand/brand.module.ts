import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { S3 } from 'src/utils/s3'
import { Brand } from './brand.entity'
import { BrandResolver } from './brand.resolver'
import { BrandService } from './brand.service'

import { BrandSlugIsUnique } from './validations/BrandSlugIsUnique'

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  providers: [BrandService, BrandResolver, BrandSlugIsUnique, S3]
})
export class BrandModule {}
