import ResponsiveWrapper from "components/responsive-wrapper";

export default function CreateBountyContainer({ children }) {
  return (
    <>
      <ResponsiveWrapper
        xs={true}
        md={false}
        className="flex-column bg-gray-900 p-4 border-radius-4 border border-gray-850"
      >
        {children}
      </ResponsiveWrapper>
      <ResponsiveWrapper xs={false} md={true} className="flex-column">
        {children}
      </ResponsiveWrapper>
    </>
  );
}
