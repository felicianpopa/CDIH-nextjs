import Container from "react-bootstrap/Container";
import { Navigation } from "navigation-next";
import Link from "next/link";
import Image from "next/image";
import HeaderDropdown from "./HeaderDropdown";

const Header = () => {
  const links = [
    {
      name: "",
      value: "/",
      label: "Dashboard",
      icon: "chartLine",
    },
    {
      name: "clients",
      value: "/clients",
      label: "Clients",
      icon: "users",
    },
    { name: "offers", value: "/offers", label: "Offers", icon: "gift" },
    {
      name: "products",
      value: "/products",
      label: "Products",
      icon: "boxesStacked",
    },
    {
      name: "reports",
      value: "/reports",
      label: "Reports",
      icon: "sheetPlastic",
    },
    {
      name: "aicallcenter",
      value: "/aicallcenter",
      label: "Ai Callcenter",
      icon: "headset",
    },
    {
      name: "integrations",
      value: "/integrations",
      label: "Integrations",
      icon: "puzzlePiece",
    },
    { name: "settings", value: "/settings", label: "Settings", icon: "gear" },
  ];

  return (
    <div className="main-header">
      <Container fluid>
        <div className="main-header__inner">
          <Navigation
            links={links}
            usePortal={false}
            defaultOpen={true}
            LinkComponent={Link}
          />
          <Link href="/" className="main-logo">
            <Image
              src="/logo.webp"
              alt="logo"
              width={120}
              height={60}
              priority
            />
          </Link>
          <HeaderDropdown />
        </div>
      </Container>
    </div>
  );
};

export default Header;
