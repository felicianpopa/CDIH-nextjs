"use client";

import { useRouter, usePathname } from "next/navigation"; // Changed from next/router to next/navigation
import { useCookies } from "react-cookie";
import { ReactNode, useEffect, useState } from "react";

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles: string[];
}

const RequireAuth = ({ children, allowedRoles }: RequireAuthProps) => {
  const [cookies] = useCookies(["bitUserData"]);
  const userCookies = cookies["bitUserData"];
  const router = useRouter(); // This hook is from next/navigation now
  const pathname = usePathname(); // Get the current path
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    setIsChecking(true);

    const hasRequiredRole = userCookies?.user_roles?.find((role: string) =>
      allowedRoles?.includes(role)
    );

    if (!hasRequiredRole) {
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }

    setIsChecking(false);
  }, [userCookies, allowedRoles, router, pathname]); // Added pathname to dependencies

  if (isChecking) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? <>{children}</> : null;
};

export default RequireAuth;
