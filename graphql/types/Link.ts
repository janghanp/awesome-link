import { extendType, intArg, objectType, stringArg } from "nexus";
import { User } from "./User";
import { Link as LinkType } from "@prisma/client";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.int("id");
    t.string("title");
    t.string("url");
    t.string("description");
    t.string("imageUrl");
    t.string("category");
    t.list.field("users", {
      type: User,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.link
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .users();
      },
    });
  },
});

export const Edge = objectType({
  name: "Edge",
  definition(t) {
    t.string("cursor");
    t.field("node", {
      type: Link,
    });
  },
});

export const PageInfo = objectType({
  name: "PageInfo",
  definition(t) {
    t.string("endCursor");
    t.boolean("hasNextPage");
  },
});

export const Response = objectType({
  name: "Response",
  definition(t) {
    t.field("pageInfo", { type: PageInfo });
    t.list.field("edges", {
      type: Edge,
    });
  },
});

export const LinksQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("links", {
      type: "Response",
      args: {
        count: intArg(),
        cursor: stringArg(),
      },
      async resolve(_, args, ctx) {
        let queryResults = null;

        if (args.cursor) {
          // check if there is a curosr as the argument
          queryResults = await ctx.prisma.link.findMany({
            take: args.count,
            skip: 1,
            cursor: {
              id: args.cursor,
            },
          });
        } else {
          console.log("It looks like the it is the first query!");
          // no cursor, chiche means this is going to be a first query
          queryResults = await ctx.prisma.link.findMany({
            take: args.count,
          });
        }

        // if the initial request returns links
        // - get a cursor to be used for the next query
        // - check if there is a left page to fetch
        if (queryResults.length > 0) {
          const lastLinkInResults = queryResults[queryResults.length - 1];

          // get a cursor
          const myCursor = lastLinkInResults.id;

          //query for checking the absence of a next pages
          const secondQueryResults = await ctx.prisma.link.findMany({
            take: args.conut,
            skip: 1,
            cursor: {
              id: myCursor,
            },
            orderBy: {
              createdAt: "asc",
            },
          });

          const result = {
            pageInfo: {
              endCursor: myCursor,
              hasNextPage: secondQueryResults.length > 0,
            },
            edges: queryResults.map((link: LinkType) => ({
              cursor: link.id,
              node: link,
            })),
          };

          return result;
        } else {
          return {
            pageInfo: {
              endCursor: null,
              hasNextPage: false,
            },
            edges: [],
          };
        }
      },
    });
  },
});
