import {ReactElement} from "react";

import {useTranslation} from "next-i18next";

import If from "components/If";
import InfoTooltip from "components/info-tooltip";
import {ResponsiveEle} from "components/responsive-wrapper";

export default function RenderItemRow({
  children,
  label = "",
  description = "",
  borderBottom = true,
  tooltip,
  classNameChildren,
  handleLink,
}: {
  children: ReactElement;
  label: string;
  description: string;
  borderBottom?: boolean;
  tooltip?: string;
  classNameChildren?: string;
  handleLink?: () => void;
}) {
  const { t } = useTranslation(["common"]);

  function Link() {
    return (
      <a onClick={handleLink} className="ms-1 text-primary cursor-pointer">
        {t("common:misc.learn-more")}
      </a>
    );
  }

  return (
    <div
      className={`mt-4 pb-4 ${
        borderBottom ? "border-bottom border-gray-700" : ""
      }`}
    >
      <div className="d-flex justify-content-between">
        <label className="d-flex align-items-center gap-2 text-white">
          {label}
          <If condition={!!tooltip}>
            <InfoTooltip description={tooltip} />
          </If>
        </label>
        {handleLink && <ResponsiveEle mobileView={Link()} />}
      </div>

      <div className="row justify-content-between">
        <div className="col-md-6 col-12 text-gray mt-1">
          {handleLink
            ? <ResponsiveEle mobileView={description}
                             desktopView={<>{description} {Link()}</>} />
            : description
          }
        </div>
        <div
          className={
            classNameChildren ? classNameChildren : "col-md-4 col-12 mt-1"
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
