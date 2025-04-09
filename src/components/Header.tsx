import { useRef } from "react";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Navigation } from "Navigation";
import LogOut from "./LogOut";
import Link from "next/link";
import { useCookies } from "react-cookie";
import Image from "next/image";

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

  const navigationRef = useRef<any>();

  const [cookies] = useCookies(["bitUser"]);
  const userCookies = cookies["bitUser"];

  return (
    <header className="main-header">
      <Container fluid>
        <div className="main-header__inner">
          <Navigation links={links} ref={navigationRef} />
          <Link href="/" className="main-logo">
            <Image
              src="/logo.webp"
              alt="logo"
              width={120}
              height={60}
              priority
            />
          </Link>
          <div className="my-account-navigation">
            <DropdownButton title="Account">
              {userCookies && (
                <>
                  <Dropdown.Item as="div">
                    <Link href="/account/my-profile">My Profile</Link>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                </>
              )}
              <div className="dropdown-extra">
                {userCookies ? (
                  <LogOut
                    extraActions={() => {
                      navigationRef.current?.handleClose();
                    }}
                  />
                ) : (
                  <Link href="/login" className="btn btn-primary">
                    Log in
                  </Link>
                )}
              </div>
            </DropdownButton>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
