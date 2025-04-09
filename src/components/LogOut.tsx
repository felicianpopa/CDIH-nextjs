import { useState } from "react";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import { useLogout } from "web-authentication";
import { useConfig } from "../configurations/ConfigProvider";

interface LogOutProps {
  extraActions?: () => void;
}

const LogOut = ({ extraActions = () => {} }: LogOutProps) => {
  const config = useConfig();
  const [logoutStatus, setLogoutStatus] = useState<string | null>(null);
  const logOut = useLogout(config.server.apiUrl);
  const router = useRouter();

  const handleClick = async () => {
    try {
      await logOut();
      extraActions();
      router.push("/login");
      setLogoutStatus("Logout successful");
    } catch (error: any) {
      console.error("Logout failed:", error);
      setLogoutStatus(
        `Logout failed, ${error.response?.data?.message || "Unknown error"}`
      );
    }
  };

  return (
    <div>
      <Button onClick={handleClick}>Log out</Button>
      {logoutStatus && <p className="text-danger">{logoutStatus}</p>}
    </div>
  );
};

export default LogOut;
