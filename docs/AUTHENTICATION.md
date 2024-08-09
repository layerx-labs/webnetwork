## 1. NEXTAUTH

NextAuth requires a environment key to be able to use JWT, so to generate the key, run:

```console
$ openssl rand -base64 32
```

Then fill in the value into .env file;

```text
# .env

NEXTAUTH_SECRET=yourKey
NEXTAUTH_URL=http://localhost:3000 or yourDomain.
```