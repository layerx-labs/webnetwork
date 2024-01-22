import { api } from "services/api";

export async function useUpdateEmail(email: string) {
  return api
          .put("/user/connect/email", { email })
          .then(({ data }) => data)
          .catch(error => {
            throw(error.response.data);
          });
}