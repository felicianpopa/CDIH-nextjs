"use client";

import NextLogin from "@/components/NextLogin";
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
  return (
    <NextLogin>
      <LoginHeader />
    </NextLogin>
  );
};

export default LoginPage;
