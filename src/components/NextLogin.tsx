"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCookies } from "react-cookie";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles: string[];
}

const RequireAuth = ({ children, allowedRoles }: RequireAuthProps) => {
  const [cookies] = useCookies(["bitUserData"]);
  const userCookies = cookies["bitUserData"];
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setIsChecking(true);

    // First check if the user is authenticated at all
    if (isAuthenticated === false) {
      router.push("/login");
      return;
    }

    // Then check if they have the required role
    if (isAuthenticated === true) {
      const hasRequiredRole = userCookies?.user_roles?.find((role: string) =>
        allowedRoles?.includes(role)
      );

      if (!hasRequiredRole) {
        router.push("/login");
      } else {
        setIsAuthorized(true);
      }
    }

    setIsChecking(false);
  }, [isAuthenticated, userCookies, allowedRoles, router, pathname]);

  if (isAuthenticated === null || isChecking) {
    return <div className="d-flex justify-content-center p-5">Loading...</div>;
  }

  return isAuthorized ? <>{children}</> : null;
};

export default RequireAuth;
