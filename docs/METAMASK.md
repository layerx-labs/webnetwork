## 1. ETHEREUM NETWORK SETUP

Make sure you have the [Metamask](https://metamask.io/download/) extension installed.
Then fill in the ENV file with Ethereum EVM Network, for example using Amoy.
<br>

```text
# .env

# Create a new infura provider (or any other web3 provider) and add the id here
NEXT_PUBLIC_WEB3_CONNECTION=https://rpc-amoy.polygon.technology

# MetaMask Network Configs
NEXT_PUBLIC_NATIVE_TOKEN_NAME=MATIC
NEXT_PUBLIC_NEEDS_CHAIN_ID=80002
NEXT_PUBLIC_NEEDS_CHAIN_NAME=amoy
NEXT_PUBLIC_BLOCKSCAN_LINK=https://www.oklink.com/amoy
NEXT_PUBLIC_CHAIN_DECIMALS=18
```

Or emulate your own blockchain using [Ganache](../docs/GANACHE.md).

## 2. ADMIN WALLET

The admin wallet is the address of the contracts governor, this person will be able
to manage the default network, also to access the `/administration` page where actions to manage the default settings for `ERC20` and `Network` are available. Check Networks Manager [doc](../docs/NETWORK-MANAGER.md) for more.

```text
# .env

NEXT_PUBLIC_ADMIN_WALLET_ADDRESS=yourwalletaddress
NEXT_WALLET_PRIVATE_KEY=yourwalletprivatekey
```
