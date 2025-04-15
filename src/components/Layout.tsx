"use client";

import { ReactNode, useEffect, useState } from "react";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import { useCookies } from "react-cookie";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [cookies] = useCookies(["bitUser"]);
  const userCookies = cookies["bitUser"];
  const [isMounted, setIsMounted] = useState(false);

  // Use useEffect to handle client-side rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render Header on the client side to prevent hydration mismatch
  return (
    <>
      {isMounted && userCookies && <Header />}
      <div className="main-content">
        <Container fluid>{children}</Container>
      </div>
    </>
  );
};

export default Layout;
