import BountyCommentsView from "./view";

export default function BountyComments({
  comments = [],
  userAddress,
  issueId,
}) {
  return <BountyCommentsView comments={comments} userAddress={userAddress} />;
}
