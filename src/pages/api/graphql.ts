// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ApolloServer } from "apollo-server-micro";
import Cors from "micro-cors";

import { typeDefs } from "../../../graphql/schema";
import { resolvers } from "../../../graphql/resolvers";

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
const apolloServer = new ApolloServer({ typeDefs, resolvers });

//so is it basically starting the graphql server everytime the api route gets a request?
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

export const config = {
  api: {
    bodyParser: false,
  },
};
