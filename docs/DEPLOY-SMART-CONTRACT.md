## 1. DEPLOY SMART-CONTRACT

1. Before deploying the contracts make sure your database is updated by running the migrate command:

```bash
$ npm run migrate
```

2. Then execute the command below, replacing `[PRIVATE_KEY]` with your test wallet private key, to deploy the contracts and save them in the database:

```bash
$ node ./scripts/deploy-multichain -n amoy-local -k [PRIVATE_KEY] -e .env -d
```