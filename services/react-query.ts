import { QueryClient } from "@tanstack/react-query";

export const reactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10 // 10s
    }
  }
});