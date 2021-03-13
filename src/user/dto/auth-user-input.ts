import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class AuthUserInput {
  @Field()
  email: string

  @Field()
  password: string
}
