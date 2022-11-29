import { GraphQLError } from 'graphql';
import bcrypt from 'bcryptjs';
import cloudinary from 'cloudinary';

import { prisma } from '../lib/prisma';

export const resolvers = {
  Query: {
    async getUser(parent, args, context, info) {
      const { email } = args;

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          bookmarks: true,
        },
      });

      return user;
    },
    async getLinks(parent, args, context, info) {
      const { after } = args;
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
    },

    async getBookmarkLinks(parent, args, context, info) {
      const { after, userId } = args;

      let queryResults = null;

      if (after) {
        //Following requests after first one.
        queryResults = await prisma.link.findMany({
          where: {
            users: {
              some: {
                id: parseInt(userId),
              },
            },
          },
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
          where: {
            users: {
              some: {
                id: parseInt(userId),
              },
            },
          },
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
    },
  },
  Mutation: {
    async register(parent, args, context, info) {
      const { email, name, password } = args;

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (user) {
        throw new GraphQLError('The email is already in use');
      }

      const hashedPasswrod = await bcrypt.hash(password, 12);

      const newUser = await prisma.user.create({
        data: {
          name: name,
          email,
          password: hashedPasswrod,
        },
      });

      return newUser;
    },
    async updateProfile(parent, args, context, info) {
      const { email, image, public_id } = args;

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      const newUser = await prisma.user.update({
        where: {
          email,
        },
        data: {
          image,
          public_id,
        },
        include: {
          bookmarks: true,
        },
      });

      if (user.public_id) {
        //delete a previous image from cloudinary.
        const result = await cloudinary.v2.uploader.destroy(user.public_id);
        console.log(result);
      }

      return newUser;
    },
    async updateUserInfo(parent, args, context, info) {
      const { email, name } = args;

      const newUser = await prisma.user.update({
        where: {
          email,
        },
        data: {
          name,
        },
        include: {
          bookmarks: true,
        },
      });

      return newUser;
    },
    async bookmark(parent, args, context, info) {
      const { userId, linkId, isBookmarking } = args;

      //bookmark
      if (isBookmarking) {
        const user = await prisma.user.update({
          where: {
            id: parseInt(userId),
          },
          data: {
            bookmarks: {
              connect: {
                id: parseInt(linkId),
              },
            },
          },
          include: {
            bookmarks: true,
          },
        });

        return user;
      }

      //un-bookmark
      const user = await prisma.user.update({
        where: {
          id: parseInt(userId),
        },
        data: {
          bookmarks: {
            disconnect: {
              id: parseInt(linkId),
            },
          },
        },
        include: {
          bookmarks: true,
        },
      });

      return user;
    },
    async createLink(parent, args, context, info) {
      const { title, description, url, imageUrl, public_id } = args;

      const link = await prisma.link.create({
        data: {
          title,
          description,
          url,
          imageUrl,
          public_id,
        },
      });

      const result = {
        cursor: link.id,
        node: link,
      };

      console.log({ result });

      return result;
    },
    async updateLink(parent, args, context, info) {
      const { id, title, description, url, imageUrl, public_id } = args;

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
    },
    async deleteLink(parent, args, context, info) {
      const { id, public_id } = args;

      const link = await prisma.link.delete({
        where: {
          id: parseInt(id),
        },
      });

      //delete an image from cloudinary
      await cloudinary.v2.uploader.destroy(public_id);

      return link;
    },
  },
};
