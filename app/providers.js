// app/providers.tsx
"use client";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme";

import { QueryClientProvider } from "@tanstack/react-query";
import { AppProps } from "next/app";
import { QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </QueryClientProvider>
  );
}
