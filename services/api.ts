import axios from "axios";
import getConfig from "next/config";

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

export const baseApiUrl = `${publicRuntimeConfig?.urls?.api}/api`;
export const baseApiImgUrl = `${baseApiUrl}/img`;

export const api = axios.create({
  baseURL: baseApiUrl
});

export const kycApi = axios.create({
  baseURL: `${publicRuntimeConfig?.urls?.kyc}`
});

api.interceptors.request.use(config => {

  if (typeof window === 'undefined')
    return config;

  const currentWallet = sessionStorage.getItem("currentWallet") || ''
  const currentSignature = sessionStorage.getItem("currentSignature") || undefined;
  const currentChainId = sessionStorage.getItem("currentChainId") || 0;

  if (currentWallet)
    config.headers["wallet"] = currentWallet;

  if (currentSignature)
    config.headers["signature"] = currentSignature;

  if (+currentChainId)
    config.headers["chain"] = +currentChainId;

  return config;
});

api.interceptors.response.use((response) => response,
                              (error) => {
                                console.debug("Failed", error);
                                throw error;
                              });

api.interceptors.request.use(config => {

  if (typeof window === 'undefined')
    return config;

  const currentWallet = sessionStorage.getItem("currentWallet") || ''
  const currentSignature = sessionStorage.getItem("currentSignature") || undefined;
  const currentChainId = sessionStorage.getItem("currentChainId") || 0;

  if (currentWallet)
    config.headers["wallet"] = currentWallet;

  if (currentSignature)
    config.headers["signature"] = currentSignature;

  if (+currentChainId)
    config.headers["chain"] = +currentChainId;

  return config;
});

kycApi.interceptors.request.use(function (config) {
  if (serverRuntimeConfig.kyc.key && serverRuntimeConfig.kyc.clientId) {
    config.headers["Api-Key"] = serverRuntimeConfig.kyc.key;
    config.headers["Client-Id"] = serverRuntimeConfig.kyc.clientId;
  }
                                    
  return config;
});
                                    
kycApi.interceptors.response.use((response) => response,
                                 (error) => {
                                   console.debug("[KycApi] Failed", error);
                                   throw error;
                                 });
                                    
export default { api, kycApi };

