import { Resolver, Query, Arg, Ctx } from "type-graphql";

import { User } from "./type";
import type { MyContext } from "../../context";

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async getUsers (@Ctx() ctx: MyContext) {
    return await ctx.prisma.user.findMany();
  }
}
