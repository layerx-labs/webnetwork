import getConfig from "next/config";
import {event} from "nextjs-google-analytics";

import {useAppState} from "contexts/app-state";

import {analyticEvents} from "helpers/analytic-events";

import {Analytic, EventName} from "interfaces/analytics";

import useSupportedChain from "./use-supported-chain";

export default function useAnalyticEvents() {

  const {state} = useAppState();
  const { connectedChain } = useSupportedChain();
  const {publicRuntimeConfig} = getConfig();

  /**
   *
   * @param eventName name of the event to be sent (must exist in analyticsEvents const)
   * @param details details to be sent in that event
   */
  function pushAnalytic(eventName: EventName, details: {[options: string]: string | boolean} = {}) {

    function getCallback({type}: Analytic) {
      const reject = (message: string) => (a: string, b: any) => Promise.reject(message)

      const rejectMissingParams = (params: string | string[]) =>
        reject(`Missing Params ${JSON.stringify(params)}`)

      switch (type) {
      case "ga4":
        if (!publicRuntimeConfig.gaMeasureID)
          return rejectMissingParams(`publicRuntimeConfig.gaMeasureID`);
        return event;
      default:
        return reject(`Missing implementation for ${type}`);
      }
    }

    if (state?.currentUser) {
      details = {
        ...details,
        walletAddress: state.currentUser?.walletAddress?.toString(),
        connected: state.currentUser?.connected?.toString(),
        login: state.currentUser?.login
      };
    }


    if (connectedChain)
      details = {
        ...details,
        ...connectedChain,
      }

    if (eventName in analyticEvents)
      return Promise.all(analyticEvents[eventName]
            .map(getCallback)
            .map(call => {
              return call(eventName, details);
            }))
        .then(() => {
          return true;
        })
        .catch(e => {
          console.error(`Failed to push events`, e?.message || e?.toString() || "could not get error");
          return false;
        });
    else {
      // eslint-disable-next-line no-console
      console.debug(`Add event ${eventName} to analyticEvents index!`)
    }

    return false;
  }

  return {
    pushAnalytic
  }
}