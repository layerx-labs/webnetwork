import {ResponsiveEle} from "components/responsive-wrapper";

export default function CreateBountyContainer({ children }) {
  return (
    <>
      {/* todo: make this with a bit more sense, classes shouldn't change so much because of view */}
      <ResponsiveEle className="flex-column justify-content-between bg-gray-900 border-radius-4 border border-gray-850 min-vh-90"
                     tabletView={null}
                     mobileView={children} />

      <ResponsiveEle className="flex-column"
                     tabletView={children} />

    </>
  );
}
