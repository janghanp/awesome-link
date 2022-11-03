export const resolvers = {
  Query: {
    links: (_parent: any, _args: any, ctx:any) => {
      return ctx.prisma.findMany();
    },
  },
};
