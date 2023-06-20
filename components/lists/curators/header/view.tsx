import { useTranslation } from "next-i18next";

export default function CuratorListHeader() {
  const { t } = useTranslation("council");

  const columns = [
    t("council-table.address"),
    t("council-table.closed-proposals"),
    t("council-table.disputed-proposals"),
    t("council-table.disputes"),
    t("council-table.total-votes"),
    t("council-table.actions"),
  ];

  function renderListBarColumn(label: string, key: number) {
    return (
      <div
        key={`${key}-${label}`}
        className={`col d-flex flex-row justify-content-center align-items-center 
        text-gray`}
      >
        <span className="caption-medium mr-1">{label}</span>
      </div>
    );
  }

  return (
    <div className="row pb-0 pt-2 mx-0 mb-2 svg-with-text-color">
      {columns.map(renderListBarColumn)}
    </div>
  );
}
