import React, { useState } from "react";

import {QueryClientProvider, HydrationBoundary} from '@tanstack/react-query'
import {GetServerSideProps} from "next";
import {SessionProvider} from "next-auth/react";
import {appWithTranslation} from "next-i18next";
import {AppProps} from "next/app";
import getConfig from "next/config";
import {useRouter} from "next/router";
import {GoogleAnalytics} from "nextjs-google-analytics";

import ConsentCookie from "components/consent-cokie";
import Loading from "components/loading";
import RootModals from "components/modals/root-modals/root-modals.controller";
import NavBar from "components/navigation/navbar/controller";
import ReadOnlyContainer from "components/read-only-container";
import Seo from "components/seo";
import Toaster from "components/toaster";

import RootProviders from "contexts";

import { getReactQueryClient } from "services/react-query";

import "../styles/styles.scss";
import "../node_modules/@primer/css/dist/markdown.css";

const { publicRuntimeConfig } = getConfig();

function App({ Component, pageProps: { session, seoData, ...pageProps } }: AppProps) {
  const {asPath} = useRouter();

  const [queryClient] = useState(() => getReactQueryClient());

  if (asPath.includes('api-doc'))
    return <Component {...pageProps}></Component>

  return (
    <>
      <GoogleAnalytics gaMeasurementId={publicRuntimeConfig.gaMeasureID} trackPageViews />
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <RootProviders>
            <HydrationBoundary state={pageProps.dehydratedState}>
              <Seo issueMeta={seoData} />
              <ReadOnlyContainer>
                <RootModals />
                <NavBar />
                <div id="root-container">
                  <Component {...pageProps} />
                </div>
                <Toaster />
                <Loading />
              </ReadOnlyContainer>
            </HydrationBoundary>
          </RootProviders>
        </QueryClientProvider>
      </SessionProvider>
      <ConsentCookie />
    </>
  );
}

export default appWithTranslation(App);

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
