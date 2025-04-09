import { ReactNode } from "react";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import { useCookies } from "react-cookie";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [cookies] = useCookies(["bitUser"]);
  const userCookies = cookies["bitUser"];

  return (
    <>
      {userCookies && <Header />}
      <main>
        <Container fluid>{children}</Container>
      </main>
    </>
  );
};

export default Layout;
