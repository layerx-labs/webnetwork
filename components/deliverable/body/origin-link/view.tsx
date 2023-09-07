import { useTranslation } from "next-i18next";

export default function DeliverableOriginLink({ url }: { url: string }) {
  const { t } = useTranslation(["deliverable"]);

  return (
    <div className="border-radius-8 p-3 bg-gray-900 mb-3">
      <h3 className="caption-medium mb-3">{t("create.labels.origin-link")}</h3>
      <div className="d-flex justify-content-center p-1 border-radius-8 bg-gray-850 mb-3 border-gray-700 border">
        <a href={url} target="_blank">
          {url}
        </a>
      </div>
    </div>
  );
}
