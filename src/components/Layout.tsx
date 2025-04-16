"use client";

import { ReactNode } from "react";
import Header from "./Header";
import Container from "react-bootstrap/Container";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <div className="main-content">
        <Container fluid>{children}</Container>
      </div>
    </>
  );
};

export default Layout;
