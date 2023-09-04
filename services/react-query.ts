import { QueryClientConfig } from "@tanstack/react-query";

export const reactQueryConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10s
    },
  }
};