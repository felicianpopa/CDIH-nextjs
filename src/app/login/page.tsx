"use client";

import { Login } from "web-authentication";
import { useConfig } from "@/configurations/ConfigProvider";
import { useRouter } from "next/navigation"; // Changed from next/router to next/navigation
import Image from "next/image";

const LoginHeader = () => {
  return (
    <div className="login-header text-center">
      <Image src="/logo.webp" alt="logo" width={150} height={75} priority />
      <h2>Welcome Back!</h2>
      <p>Sign in to continue to HUB De Case</p>
    </div>
  );
};

const LoginPage = () => {
  const config = useConfig();
  const router = useRouter(); // This hook is from next/navigation now
  console.warn(config.server.apiUrl);

  const handleLoginSuccess = (data: any) => {
    router.push("/");
  };

  return (
    <Login
      loginUrl={config.routes.login}
      cookiesAge={86400}
      loginSuccess={handleLoginSuccess}
      apiUrl={config.server.apiUrl}
      getUserDataUrl={config.routes.getUserData}
    >
      <LoginHeader />
    </Login>
  );
};

export default LoginPage;
