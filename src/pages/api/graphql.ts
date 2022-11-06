// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import 'reflect-metadata';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApolloServer } from 'apollo-server-micro';
import { buildSchema } from 'type-graphql';
// @ts-ignore
import Cors from 'micro-cors';
import cloudinary from 'cloudinary';

import { createContext } from '../../graphql/context';
import { UserResolver } from '../../graphql/schema/user/resolver';
import { LinkResolver } from '../../graphql/schema/link/resovler';

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.v2.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

const cors = Cors({
  origin: 'https://studio.apollographql.com',
  allowCredentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['access-control-allow-credentials', 'access-control-allow-origin', 'content-type'],
});

const schema = await buildSchema({
  resolvers: [UserResolver, LinkResolver],
});

const apolloServer = new ApolloServer({
  schema,
  context: createContext,
});

const startServer = apolloServer.start();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  await startServer;

  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
};

export default cors(handler);
