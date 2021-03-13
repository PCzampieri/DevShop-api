import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'
import { BrandService } from '../brand.service'

@ValidatorConstraint({ name: 'brandSlugIsUnique', async: true })
export class BrandSlugIsUnique implements ValidatorConstraintInterface {
  constructor(private readonly brandService: BrandService) {}
  async validate(
    text: string,
    validationArguments: ValidationArguments
  ): Promise<boolean> {
    const id = validationArguments.object['id']
    const brandExists = await this.brandService.findBySlug(text)
    if (brandExists) {
      if (id) {
        // update
        if (id === brandExists.id) {
          return true
        }
      }
      return false
    }
    return true
  }
  defaultMessage(): string {
    return 'Slug must be unique'
  }
}
