// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import "reflect-metadata";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApolloServer } from "apollo-server-micro";
import { buildSchema } from "type-graphql";
// @ts-ignore
import Cors from "micro-cors";

import { createContext } from "../../graphql/context";
import { UserResolver } from "../../graphql/schema/user/resolver";

export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  origin: "https://studio.apollographql.com",
  allowCredentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE"],
  allowHeaders: [
    "access-control-allow-credentials",
    "access-control-allow-origin",
    "content-type",
  ],
});

const schema = await buildSchema({
  resolvers: [UserResolver],
});

const apolloServer = new ApolloServer({
  schema,
  context: createContext,
});

const startServer = apolloServer.start();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await startServer;

  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
};

export default cors(handler);
