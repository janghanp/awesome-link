import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { GraphQLError } from "graphql";
import bcrypt from "bcryptjs";

import { User } from "./type";
import { prisma } from "../../../lib/prisma";
import { User as UserPrisma } from "@prisma/client";

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async getUsers() {
    return await prisma.user.findMany();
  }

  @Mutation(() => User)
  async register(
    @Arg("email") email: string,
    @Arg("name") name: string,
    @Arg("password") password: string
  ): Promise<UserPrisma> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw new GraphQLError("The email is already in use");
    }

    const hashedPasswrod = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPasswrod,
      },
    });

    return newUser;
  }
}
