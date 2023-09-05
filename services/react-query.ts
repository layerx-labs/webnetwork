import { QueryClient, QueryClientConfig } from "@tanstack/react-query";

export const reactQueryConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10s
    },
  }
};

export const getReactQueryClient = () => new QueryClient(reactQueryConfig);