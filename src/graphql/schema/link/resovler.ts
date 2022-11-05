import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { GraphQLError } from "graphql";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";

import { Link } from "./type";
import { prisma } from "../../../lib/prisma";
import { Link as LinkType } from "@prisma/client";

@Resolver(Link)
export class LinkResolver {
  @Mutation(() => Link)
  async createLink(
    @Arg("title") title: string,
    @Arg("description") description: string,
    @Arg("url") url: string,
    @Arg("imageUrl") imageUrl: string,
    @Arg("public_id") public_id: string
  ): Promise<LinkType> {
    const link = await prisma.link.create({
      data: {
        title,
        description,
        url,
        imageUrl,
        public_id,
      },
    });

    return link;
  }
}
