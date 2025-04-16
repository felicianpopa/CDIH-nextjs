"use client";

import { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Link from "next/link";
import { useCookies } from "react-cookie";
import LogOut from "./LogOut";

interface HeaderDropdownProps {
  onLogout?: () => void;
}

const HeaderDropdown = ({ onLogout }: HeaderDropdownProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [cookies] = useCookies(["bitUser"]);
  const userCookies = cookies["bitUser"];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render after client-side hydration is complete
  if (!isMounted) {
    return null;
  }

  return (
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
                if (onLogout) {
                  onLogout();
                }
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
  );
};

export default HeaderDropdown;
