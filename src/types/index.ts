import { Prisma, User, Link } from '@prisma/client';

const linkWithUsers = Prisma.validator<Prisma.LinkArgs>()({
  include: { users: true },
});

const userWithBookmarks = Prisma.validator<Prisma.UserArgs>()({
  include: { bookmarks: true },
});

export type { User, Link };

export type LinkWithUsers = Prisma.LinkGetPayload<typeof linkWithUsers>;

export type UserWithBookmarks = Prisma.UserGetPayload<typeof userWithBookmarks>;

export interface LinkWithCursor {
  cursor: string;
  node: Link;
}
