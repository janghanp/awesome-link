import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import cloudinary from 'cloudinary';

import { Link, Response } from './type';
import { prisma } from '../../../lib/prisma';
import { Link as LinkType } from '../../../types';

@Resolver(Link)
export class LinkResolver {
  @Query(() => Response)
  async getLinks(@Arg('after', { nullable: true }) after: string): Promise<any> {
    let queryResults = null;

    if (after) {
      //Following requests after first one.
      queryResults = await prisma.link.findMany({
        take: 9,
        skip: 1,
        cursor: {
          id: Number(after),
        },
        include: {
          users: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      //First reuquest without after
      queryResults = await prisma.link.findMany({
        take: 9,
        include: {
          users: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    if (queryResults.length > 0) {
      const lastLinkInResults = queryResults[queryResults.length - 1];

      const myCursor = lastLinkInResults.id;

      const result = {
        pageInfo: {
          endCursor: myCursor,
          hasNextPage: !(queryResults.length < 9),
        },
        edges: queryResults.map((link) => ({ cursor: link.id, node: link })),
      };

      return result;
    }

    return {
      pageInfo: {
        endCursor: '',
        hasNextPage: false,
      },
      edges: [],
    };
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
      orderBy: {
        createdAt: 'desc',
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
