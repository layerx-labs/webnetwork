import { ReactElement } from "react";

import ResponsiveWrapper from "components/responsive-wrapper";

export default function RenderItemRow({
  children,
  label = "",
  description = "",
  borderBottom = true,
  handleLink,
}: {
  children: ReactElement;
  label: string;
  description: string;
  borderBottom?: boolean;
  handleLink?: () => void;
}) {
  return (
    <div
      className={`mt-4 pb-4 ${
        borderBottom ? "border-bottom border-gray-700" : ""
      }`}
    >
      <label className="text-white">{label}</label>
      <div className="row justify-content-between">
        <div className="col-md-6 col-12 text-gray mt-1">
          {handleLink ? (
            <ResponsiveWrapper xs={false} md={true}>
              <div>
                {description}
                <a
                  onClick={handleLink}
                  className="ms-1 text-primary cursor-pointer"
                >
                  Learn more
                </a>
              </div>
            </ResponsiveWrapper>
          ) : (
            description
          )}
        </div>
        <div className="col-md-4 col-12 mt-1">{children}</div>
      </div>
    </div>
  );
}
