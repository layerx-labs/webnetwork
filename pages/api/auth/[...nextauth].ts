import NextAuth, { Account } from "next-auth";

import { providersConfigsArray, providersCallbacksMap } from "server/auth/providers";

export default NextAuth({
  providers: providersConfigsArray,
  pages: {
    signIn: "/auth/signin"
  },
  session:{
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  callbacks: {
    async signIn(params) {
      try {
        const provider = params?.account?.provider;
        
        const callback = providersCallbacksMap[provider]?.signIn;

        if (callback)
          return callback(params);

        return true;
      } catch(e) {
        console.log("SignIn Callback", e);
        return false;
      }
    },
    async jwt(params) {
      try {
        const provider = params?.account?.provider;
        
        const callback = providersCallbacksMap[provider]?.jwt;

        if (callback)
          return {
            ...await callback(params),
            provider
          }
      } catch(e) {
        console.log("JWT Callback", e);
      }

      return {
        ...params,
        params
      };
    },
    async session(params) {
      try {
        const provider = (params?.token?.account as Account)?.provider;
        
        const callback = providersCallbacksMap[provider]?.jwt;

        if (callback)
          return callback(params);
      } catch(e) {
        console.log("JWT Callback", e);
      }

      return params;
    },
  },
});
