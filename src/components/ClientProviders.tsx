"use client";

import { ReactNode } from "react";
import { CookiesProvider } from "react-cookie";
import { ConfigProvider } from "@/configurations/ConfigProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function ClientProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
          {children}
        </CookiesProvider>
      </ConfigProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
