import { isArray } from "lodash";
import { useTranslation } from "next-i18next";

import MarkedRender from "components/MarkedRender";
import ResponsiveWrapper from "components/responsive-wrapper";

interface ReviewProps {
  [name: string]: string | string[];
}

type Value = string | string[];

export default function CreateBountyReview({
  payload,
}: {
  payload: ReviewProps;
}) {
  const { t } = useTranslation(["bounty"]);

  function RenderTypeFlex({ children }) {
    const CLASS = "d-flex border-top border-gray-700 py-3 px-2";

    return (
      <>
        <ResponsiveWrapper
          xs={true}
          md={false}
          className={`${CLASS} flex-column`}
        >
          {children}
        </ResponsiveWrapper>
        <ResponsiveWrapper xs={false} md={true} className={CLASS}>
          {children}
        </ResponsiveWrapper>
      </>
    );
  }

  return (
    <div className="mt-2">
      <h5>{t("bounty:steps.review")}</h5>
      <p className="text-gray mb-4">
        {t("bounty:descriptions.review")}
      </p>
      {Object.entries(payload).map(([name, value]: [string, Value], key) => {
        if(!value || value?.length === 0) return null;
        return (
          <RenderTypeFlex key={key}>
            <div className="col-md-3 text-gray">
              {name.charAt(0).toUpperCase() + name.slice(1).replace("_", " ")}
            </div>
            <div className="col-md-9 text-truncate">
              {isArray(value) ? (
                <div className="d-flex flex-wrap">
                  {value.map((item, key) => (
                    <div className="d-flex" key={key}>
                      <div className="ball tag mt-2 mx-2" key={key}/>
                      {item}
                    </div>
                  ))}
                </div>
              ) : 
              name === 'description' ? <MarkedRender source={value}/> : value 
              }
            </div>
          </RenderTypeFlex>
        )
      })}
    </div>
  );
}
