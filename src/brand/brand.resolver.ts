import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { BrandPublic } from './dto/brand'
import { BrandService } from './brand.service'
import { BrandCreateInput } from './dto/brand-create.input'
import { BrandMappper } from './brand.mapper'
import { BrandUpdateInput } from './dto/brand-update.input'
// import { GraphQLUpload } from 'apollo-server-express'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
//import { FileUpload } from 'graphql-upload'
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/utils/jwt-auth.guard'

@Resolver(of => BrandPublic)
export class BrandResolver {
  constructor(private readonly brandService: BrandService) {}

  @Query(returns => [BrandPublic], { name: 'getAllBrands' })
  async getAllBrands(): Promise<BrandPublic[]> {
    return await this.brandService.findAll()
  }

  @Query(returns => BrandPublic, { name: 'getBrandById' })
  async getBrandById(@Args('id') id: string): Promise<BrandPublic> {
    return await this.brandService.findById(id)
  }

  @Query(returns => BrandPublic, { name: 'getBrandBySlug' })
  async getBrandBySlug(@Args('slug') slug: string): Promise<BrandPublic> {
    return await this.brandService.findBySlug(slug)
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => BrandPublic, { name: 'panelCreateBrand' })
  async createBrand(
    @Args('input')
    input: BrandCreateInput
  ): Promise<BrandPublic> {
    return this.brandService.create(BrandMappper.toEntity(input))
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => Boolean, { name: 'panelUploadBrandLogo' })
  async uploadLogo(
    @Args('id') id: string,
    @Args('file', { type: () => GraphQLUpload })
    file: FileUpload
  ): Promise<boolean> {
    const { createReadStream, filename, mimetype } = await file
    return await this.brandService.uploadLogo(
      id,
      createReadStream,
      filename,
      mimetype
    )
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => Boolean, { name: 'panelRemoveBrandLogo' })
  async removeLogo(@Args('id') id: string): Promise<boolean> {
    return await this.brandService.removeBrandLogo(id)
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => BrandPublic, { name: 'panelUpdateBrand' })
  async updateBrand(
    @Args('input')
    input: BrandUpdateInput
  ): Promise<BrandPublic> {
    return BrandMappper.fromEntityToPlublic(
      await this.brandService.update(BrandMappper.fromUpdateToEntity(input))
    )
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => Boolean, { name: 'panelDeleteBrand' })
  async deleteBrand(@Args('id') input: string): Promise<boolean> {
    return this.brandService.delete(input)
  }
}
