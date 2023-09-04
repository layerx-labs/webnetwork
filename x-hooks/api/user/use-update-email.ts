import { api } from "services/api";

export default async function useUpdateEmail(email: string) {
  return api
          .put("/user/connect/email", { email })
          .then(({ data }) => data);
}