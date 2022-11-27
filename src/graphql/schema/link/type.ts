import { ObjectType, Field, ID } from 'type-graphql';

import { User } from '../user/type';

@ObjectType()
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

  @Field((_type) => [User], { nullable: true })
  users: User[];
}

@ObjectType()
export class Edge {
  @Field((_type) => String)
  cursor!: string;

  @Field((_type) => Link)
  node!: Link;
}

@ObjectType()
export class PageInfo {
  @Field((_type) => String)
  endCursor!: string;

  @Field((_type) => Boolean)
  hasNextPage!: boolean;
}

@ObjectType()
export class Response {
  @Field((_type) => PageInfo)
  pageInfo: PageInfo;

  @Field((_type) => [Edge])
  edges: [Edge];
}
