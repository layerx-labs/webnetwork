import { GetServerSideProps } from "next/types";

import { getBountyData } from "x-hooks/api/task";

export default () => null;

export const getServerSideProps: GetServerSideProps = async ({
  query
}) => {
  const bountyDatabase = await getBountyData(query);

  if (bountyDatabase) {
    const { id } = bountyDatabase;

    return {
      redirect: {
        destination: `task/${id}`,
        permanent: false,
      },
    };
  }

  return {
    redirect: {
        destination: '/'
    },
    props: {}
  };
};