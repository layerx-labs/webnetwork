import CommentSettingsView from "./view";

export default function CommentSettings({
  handleHide,
  isGovernor,
  hidden,
  updateBountyData,
}: {
  handleHide: () => void;
  isGovernor: boolean;
  hidden: boolean;
  updateBountyData: (updatePrData?: boolean) => void;
}) {

  function handleHideComment() {
    handleHide();
    updateBountyData();
  }

  return (
    <CommentSettingsView
      hidden={hidden}
      handleHideAction={handleHideComment}
      isGovernor={isGovernor}
    />
  );
}
