import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { GraphQLError } from "graphql";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";

import { Link } from "./type";
import { prisma } from "../../../lib/prisma";
import { Link as LinkType } from "@prisma/client";

@Resolver(Link)
export class LinkResolver {
  @Query(() => [Link])
  async getLinks(): Promise<LinkType[]> {
    const links = await prisma.link.findMany();

    return links;
  }

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

  @Mutation(() => Link)
  async deleteLink(@Arg("id") id: string, @Arg("public_id") public_id: string) {
    const link = await prisma.link.delete({
      where: {
        id: parseInt(id),
      },
    });

    //delete an image from cloudinary
    cloudinary.v2.config({
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    });

    const result = await cloudinary.v2.uploader.destroy(public_id);

    console.log(result);

    return link;
  }
}
