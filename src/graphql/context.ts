import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

import { prisma } from "../lib/prisma";

export type MyContext = {
  prisma: PrismaClient;
  session: Session | null;
};

export async function createContext({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<MyContext> {
  const session = await getSession({ req });

  return {
    prisma,
    session,
  };
}
