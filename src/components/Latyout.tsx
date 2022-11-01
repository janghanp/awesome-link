import { Paper } from "@mantine/core";
import CustomHeader from "./CustomHeader";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Paper>
        <CustomHeader />
        <main>{children}</main>
      </Paper>
    </>
  );
}
