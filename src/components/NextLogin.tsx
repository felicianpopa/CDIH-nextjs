"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Login } from "web-authentication";
import { useConfig } from "@/configurations/ConfigProvider";

interface NextLoginProps {
  children: ReactNode;
}

const NextLogin = ({ children }: NextLoginProps) => {
  const config = useConfig();
  const router = useRouter();
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  // Store the previous path when component mounts
  useEffect(() => {
    // Get the referrer from document.referrer if available
    if (document.referrer) {
      try {
        const referrerUrl = new URL(document.referrer);
        // Only consider referrers from the same origin
        if (referrerUrl.origin === window.location.origin) {
          // Extract just the path portion
          setPreviousPath(referrerUrl.pathname);
        }
      } catch (e) {
        console.error("Error parsing referrer:", e);
      }
    }

    // Check for previously stored path in sessionStorage
    const storedPath = sessionStorage.getItem("redirectAfterLogin");
    if (storedPath) {
      setPreviousPath(storedPath);
    }
  }, []);

  const handleLoginSuccess = () => {
    if (
      previousPath &&
      previousPath !== "/login" &&
      previousPath !== "/register"
    ) {
      // Navigate to previous path
      router.push(previousPath);
      // Clean up the stored path
      sessionStorage.removeItem("redirectAfterLogin");
    } else {
      // If no valid previous path, go to homepage
      router.push("/");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        {children}

        <Login
          cookiesAge={86400}
          apiUrl={config.server.apiUrl}
          loginUrl={config.routes.login}
          loginSuccess={handleLoginSuccess}
          getUserDataUrl="/api/me"
        />
      </div>
    </div>
  );
};

export default NextLogin;
