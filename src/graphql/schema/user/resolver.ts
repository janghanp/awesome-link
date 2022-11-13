import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { GraphQLError } from 'graphql';
import bcrypt from 'bcryptjs';
import cloudinary from 'cloudinary';

import { User } from './type';
import { prisma } from '../../../lib/prisma';
import { User as UserPrisma } from '@prisma/client';

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async getUsers() {
    const users = await prisma.user.findMany({
      include: { bookmarks: true },
    });

    return users;
  }

  @Query(() => User)
  async getUser(@Arg('email') email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        bookmarks: true,
      },
    });

    return user;
  }

  @Mutation(() => User)
  async register(
    @Arg('email') email: string,
    @Arg('name') name: string,
    @Arg('password') password: string
  ): Promise<UserPrisma> {
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
        name,
        email,
        password: hashedPasswrod,
      },
    });

    return newUser;
  }

  @Mutation(() => User)
  async updateProfile(
    @Arg('email') email: string,
    @Arg('image') image: string,
    @Arg('public_id') public_id: string
  ): Promise<UserPrisma> {
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
    });

    if (user.public_id) {
      //delete a previous image from cloudinary.
      const result = await cloudinary.v2.uploader.destroy(user.public_id);
      console.log(result);
    }

    return newUser;
  }

  @Mutation(() => User)
  async updateUserInfo(
    @Arg('email') email: string,
    @Arg('name') name: string
  ): Promise<UserPrisma> {
    const newUser = await prisma.user.update({
      where: {
        email,
      },
      data: {
        name,
      },
    });

    return newUser;
  }

  @Mutation(() => User)
  async bookmark(
    @Arg('linkId') linkId: string,
    @Arg('userId') userId: string,
    @Arg('isBookmarking') isBookmarking: boolean
  ): Promise<UserPrisma> {
    //bookmark
    if (isBookmarking) {
      console.log('bookmark');
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

    //unbookmark
    console.log('unbookmark');
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
  }
}
