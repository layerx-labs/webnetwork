import removeMarkdown from "markdown-to-text";
import {GetServerSideProps} from "next";
import {NextSeo} from "next-seo";
import getConfig from "next/config";

import PublicProfilePage from "components/pages/public-profile/public-profile.controller";

import {emptyPaginatedData} from "helpers/api";
import {isAddress} from "helpers/is-address";
import {truncateAddress} from "helpers/truncate-address";

import {User} from "interfaces/api";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

import {
  DeliverablePaginatedData,
  PaymentPaginatedData,
  ProposalPaginatedData,
  SearchBountiesPaginated
} from "types/api";

import {useSearchDeliverables} from "x-hooks/api/deliverable/use-search-deliverables";
import {useSearchPayments} from "x-hooks/api/payment/use-search-payments";
import {useSearchProposals} from "x-hooks/api/proposal/use-search-proposals";
import {getBountiesListData} from "x-hooks/api/task";
import {useGetUserByAddress, useGetUserByLogin} from "x-hooks/api/user";

import {baseApiImgUrl} from "../../services/api";
import {AnkrNftAsset} from "../../types/ankr-nft-asset";
import {getTaikaiPops} from "../../x-hooks/api/user/get-taikai-pops";

export interface PublicProfileProps {
  user: User;
  tasks?: SearchBountiesPaginated;
  deliverables?: DeliverablePaginatedData;
  proposals?: ProposalPaginatedData;
  payments?: PaymentPaginatedData;
  pops?: AnkrNftAsset[];
}

const { publicRuntimeConfig } = getConfig();

export default function PublicProfile(props: PublicProfileProps) {
  const { user } = props;
  const homeUrl = publicRuntimeConfig?.urls?.home;
  const imageUrl = user?.profileImage ? 
    `${baseApiImgUrl}/${publicRuntimeConfig.urls.ipfs}/${user?.profileImage}` :
    `${homeUrl}/images/meta-thumbnail.jpeg`;
  const about = removeMarkdown(user?.about?.substring(0, 160).trimEnd());
  let title = truncateAddress(user?.address);

  if (user?.fullName) {
    title = user.fullName.length > 25 ? `${user.fullName.slice(0, 25)}...` : user.fullName;

    if (user?.handle)
      title += ` (${user?.handle})`;
  } else if (user?.handle)
    title = user?.handle;

  return (
    <>
      <NextSeo
        title={title}
        openGraph={{
          url: `${homeUrl}/profile/${user?.handle || user?.address}`,
          title: title,
          description: `${about}...` || "",
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 670,
              alt: `${title} profile`,
              type: "image/jpeg"
            }
          ],
          site_name: "Bepro Network"
        }}
      />
      <PublicProfilePage {...props} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({req, query, locale}) => {
  const type = query?.type?.toString() || "won";
  const identifier = query?.identifier?.toString();

  const redirect404 = {
    redirect: {
      destination: `/404`,
      permanent: false,
    },
  };

  if (!identifier)
    return redirect404;

  const finderMethod = isAddress(identifier) ? useGetUserByAddress : useGetUserByLogin;

  const user = await finderMethod(identifier);
  if (!user)
    return redirect404;

  const pageData = {
    tasks: emptyPaginatedData,
    deliverables: emptyPaginatedData,
    proposals: emptyPaginatedData,
    payments: emptyPaginatedData,
    pops: [],
  };

  const getTasks = async (filter: "receiver" | "creator") =>
    getBountiesListData({[filter]: user.address, ...query})
      .then(({data}) => data)
      .catch(() => emptyPaginatedData as SearchBountiesPaginated);

  switch (type) {
  case "won":
    pageData.tasks = await getTasks("receiver");
    break;
  case "opened":
    pageData.tasks = await getTasks("creator");
    break;
  case "submissions":
    pageData.deliverables = await useSearchDeliverables({creator: user.address, ...query});
    break;
  case "proposals":
    pageData.proposals = await useSearchProposals({creator: user.address, ...query});
    break;
  case "nfts":
    pageData.payments = await useSearchPayments({wallet: user.address, ...query});
    break;
  case "taikai-pop":
    pageData.pops = await getTaikaiPops(user.address);
    break;
  }

  return {
    props: {
      user,
      ...pageData,
      ...(await customServerSideTranslations(req, locale, [
        "common",
        "bounty",
        "my-oracles",
        "connect-wallet-button",
        "profile",
        "deliverable",
        "custom-network",
        "setup",
        "change-token-modal",
        "proposal"
      ]))
    }
  };
};