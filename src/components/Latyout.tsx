import { Paper } from "@mantine/core";
import { useSession } from "next-auth/react";

import CustomHeader from "./CustomHeader";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const { status } = useSession();

  if (status === "loading") {
    return <div>loading...</div>;
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
