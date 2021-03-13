import { Field, InputType } from '@nestjs/graphql'
import { IsUUID, Length } from 'class-validator'

@InputType()
export class UserPasswordUpdateInput {
  @Field()
  @IsUUID()
  id: string

  @Field()
  @Length(6)
  password: string
}
