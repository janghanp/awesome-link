import { Paper } from "@mantine/core";
import { useSession } from "next-auth/react";

import CustomHeader from "./CustomHeader";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const { status, data: session } = useSession();

  if (status === "loading") {
    return <div>loading...</div>;
  }

  if (status === "authenticated") {
    console.log(session);
  }

  return (
    <>
      <Paper>
        <CustomHeader />
        <main>{children}</main>
      </Paper>
    </>
  );
}
