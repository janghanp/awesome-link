import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType({ description: 'The link model' })
export class Link {
  @Field((_type) => ID)
  id!: number;

  @Field((_type) => String)
  title!: string;

  @Field((_type) => String)
  description!: string;

  @Field((_type) => String)
  url!: string;

  @Field((_type) => String)
  imageUrl!: string;

  @Field((_type) => String)
  public_id!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
