import { ObjectType, Field, ID, registerEnumType } from "type-graphql";

enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

registerEnumType(Role, {
  name: "Role",
  description: "The type of roles",
  valuesConfig: {
    ADMIN: {
      description: "Admin",
    },
    USER: {
      description: "User",
    },
  },
});

@ObjectType({ description: "The user model" })
export class User {
  @Field((_type) => ID)
  id!: number;

  @Field((_type) => String)
  name!: string;

  @Field((_type) => String)
  email!: string;

  @Field((_type) => String, { nullable: true })
  image!: string;

  @Field((_type) => Role)
  role!: Role;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field({ nullable: true })
  emailVerified!: Date;
}
