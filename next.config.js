const path = require("path");

require("dotenv").config();

const { i18n } = require("./next-i18next.config");
const removeImports = require('next-remove-imports')();

const publicRuntimeConfig = {
  locales: i18n?.locales || ["en"],
  urls: {
    api: process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000",
    home: process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000",
    events: process.env.NEXT_PUBLIC_EVENTS_API || "http://localhost:3334",
    ipfs: process.env.NEXT_PUBLIC_IPFS_BASE,
    kyc: process.env.NEXT_PUBLIC_KYC_API || 'https://individual-api.synaps.io/v3',
  },
  enableCoinGecko: process.env.NEXT_ENABLE_COINGECKO,
  mainCurrency: process.env.NEXT_PUBLIC_CURRENCY_MAIN,
  adminWallet: process.env.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS,
  leaderboardPoints: {
    bountyClosedDev: process.env.NEXT_PUBLIC_BOUNTY_CLOSED_DEV || 1,
    bountyClosedOwner: process.env.NEXT_PUBLIC_BOUNTY_CLOSED_OWNER || 0.5,
    bountyOpened: process.env.NEXT_PUBLIC_BOUNTY_OPENED || 0.5,
    bountyCanceled: process.env.NEXT_PUBLIC_BOUNTY_CANCELED || -0.5,
    proposalCreated: process.env.NEXT_PUBLIC_PROPOSAL_CREATED || 0.5,
    proposalAccepted: process.env.NEXT_PUBLIC_PROPOSAL_ACCEPTED || 0.3,
    proposalRejected: process.env.NEXT_PUBLIC_PROPOSAL_REJECTED || -0.5
  },
  gaMeasureID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  kyc:{
    isEnabled: process.env.NEXT_PUBLIC_ENABLE_KYC || false
  },
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  defaultChain: {
    id: +process.env.NEXT_PUBLIC_NEEDS_CHAIN_ID || 137,
    name: process.env.NEXT_PUBLIC_NEEDS_CHAIN_NAME,
    nativeToken: process.env.NEXT_PUBLIC_NATIVE_TOKEN_NAME,
    blockscan: process.env.NEXT_PUBLIC_BLOCKSCAN_LINK,
    rpc: process.env.NEXT_PUBLIC_WEB3_CONNECTION,
    decimals: process.env.NEXT_PUBLIC_CHAIN_DECIMALS,
  },
  isProduction: process.env.NODE_ENV === "production",
  gasFactor: +(process.env.NEXT_PUBLIC_GAS_FEE_MULTIPLIER || 2),
  newFeatureModal: {
    isVisible: process.env.NEXT_PUBLIC_MODAL_FEATURE === "true",
    title: process.env.NEXT_PUBLIC_MODAL_FEATURE_TITLE,
    description: process.env.NEXT_PUBLIC_MODAL_FEATURE_DESCRIPTION,
    image: process.env.NEXT_PUBLIC_MODAL_FEATURE_IMG,
    link: process.env.NEXT_PUBLIC_MODAL_FEATURE_LINK,
  }
}

// Will only be available on the server-side
const serverRuntimeConfig = {
  auth: {
    secret: process.env.NEXTAUTH_SECRET,
    url: process.env.NEXTAUTH_URL
  },
  github: {
    clientId: process.env.NEXT_GH_CLIENT_ID,
    secret: process.env.NEXT_GH_SECRET
  },
  kyc:{
    clientId: process.env.NEXT_SYNAPS_CLIENT_ID,
    key: process.env.NEXT_SYNAPS_KEY,
    defaultTier: process.env.NEXT_SYNAPS_TIER_ID
  },
  walletPrivateKey: process.env.NEXT_WALLET_PRIVATE_KEY,
  elasticSearch: {
    username: process.env.NEXT_ELASTIC_SEARCH_USERNAME,
    password: process.env.NEXT_ELASTIC_SEARCH_PASSWORD,
    url: process.env.NEXT_ELASTIC_SEARCH_URL
  },
  infura: {
    uploadEndPoint: process.env.NEXT_IPFS_UPLOAD_ENDPOINT,
    projectId: process.env.NEXT_IPFS_PROJECT_ID,
    projectSecret: process.env.NEXT_IPFS_PROJECT_SECRET
  },
  schedules: {
    startProcessEventsAt: process.env.SCHEDULES_START_BLOCK
  },
  e2eEnabled: process.env.NEXT_E2E_TESTNET || false,
  scheduleInterval: process.env.NEXT_E2E_TESTNET || 60,
  logLevel: process.env.LOG_LEVEL,
  logStackTrace: process.env.NEXT_ELASTIC_INDEX_STACK_TRACE === "true",
  email: {
    apiKey: process.env.NEXT_SENDGRID_MAIL_API_KEY,
    from: process.env.NEXT_SENDGRID_MAIL_FROM,
    verificationCodeExpiration: process.env.NEXT_MAIL_VERIFICATION_EXPIRATION || 24
  },
  elastic:{
    rum: {
      serviceName: process.env.NEXT_ELASTIC_APM_SERVICE_NAME,
      serverUrl: process.env.NEXT_ELASTIC_APM_SERVER_URL
    },
    active: process.env.NEXT_ELASTIC_APM_ACTIVE === "true"
  },
  ankrKey: process.env.NEXT_ANKR_KEY,
  internalApiKey: process.env.NEXT_INTERNAL_API_KEY,
  imgProxy: {
    salt: process.env.IMGPROXY_SALT,
    key: process.env.IMGPROXY_KEY,
  },
  accessLogsEnabled: process.env.ACCESS_LOGS_ENABLED === "true",
}

module.exports = () => removeImports({
  i18n,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles"), path.join(__dirname, "node_modules/@primer/css/markdown")]
  },
  images: {
    domains: ["ipfs.infura.io"]
  },
  publicRuntimeConfig,
  serverRuntimeConfig,
  // webpack5: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    reactRemoveProperties: process.env.NODE_ENV === "production"
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY"
          },
          // {
          //   key: 'Content-Security-Policy',
          //   value: "default-src 'none'; img-src 'self';",
          // },
          // {
          //   key: 'X-Content-Type-Options',
          //   value: 'nosniff',
          // },
        ]
      },
      {
        source: "/api/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: `${process.env.NEXT_PUBLIC_HOME_URL || 'https://app.bepro.network'}` },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
          }
        ]
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/:network/:chain/bounties',
        destination: '/:network/tasks',
        permanent: true,
      },
      {
        source: '/:network/:chain/profile/my-network',
        destination: '/dashboard/my-marketplace',
        permanent: true,
      },
      {
        source: '/new-network',
        destination: '/new-marketplace',
        permanent: true,
      },
      {
        source: '/create-bounty',
        destination: '/create-task',
        permanent: true,
      },
      {
        source: '/:network/:chain/bounty/:id',
        destination: '/:network/task/:id',
        permanent: true,
      },
      {
        source: '/:network/:chain/bounty/:id/deliverable/:deliverableId',
        destination: '/:network/task/:id/deliverable/:deliverableId',
        permanent: true,
      },
      {
        source: '/:network/:chain/bounty/:id/proposal/:proposalId',
        destination: '/:network/task/:id/proposal/:proposalId',
        permanent: true,
      },
      {
        source: '/:network/:chain/bounty/:id/create-deliverable',
        destination: '/:network/task/:id/create-deliverable',
        permanent: true,
      },
    ]
  }
});
