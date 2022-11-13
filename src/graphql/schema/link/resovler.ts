import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import cloudinary from 'cloudinary';

import { Link } from './type';
import { prisma } from '../../../lib/prisma';
import { Link as LinkType } from '@prisma/client';

@Resolver(Link)
export class LinkResolver {
  @Query(() => [Link])
  async getLinks(): Promise<LinkType[]> {
    const links = await prisma.link.findMany({
      include: {
        users: true,
      },
    });

    return links;
  }

  @Query(() => [Link])
  async bookmarkLinks(@Arg('userId') userId: string): Promise<LinkType[]> {
    const links = await prisma.link.findMany({
      where: {
        users: {
          some: {
            id: parseInt(userId),
          },
        },
      },
      include: {
        users: true,
      },
    });

    return links;
  }

  @Mutation(() => Link)
  async createLink(
    @Arg('title') title: string,
    @Arg('description') description: string,
    @Arg('url') url: string,
    @Arg('imageUrl') imageUrl: string,
    @Arg('public_id') public_id: string
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
  async updateLink(
    @Arg('id') id: string,
    @Arg('title') title: string,
    @Arg('description') description: string,
    @Arg('url') url: string,
    @Arg('imageUrl') imageUrl: string,
    @Arg('public_id') public_id: string
  ): Promise<LinkType> {
    const link = await prisma.link.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (link.public_id !== public_id) {
      //delete an image from cloudinary
      await cloudinary.v2.uploader.destroy(link.public_id);
    }

    const newLink = await prisma.link.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        description,
        url,
        imageUrl,
        public_id,
      },
    });

    return newLink;
  }

  @Mutation(() => Link)
  async deleteLink(@Arg('id') id: string, @Arg('public_id') public_id: string) {
    const link = await prisma.link.delete({
      where: {
        id: parseInt(id),
      },
    });

    //delete an image from cloudinary
    await cloudinary.v2.uploader.destroy(public_id);

    return link;
  }
}
