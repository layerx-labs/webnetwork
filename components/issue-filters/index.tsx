import IssueDesktopFilters from "components/issue-filters/desktop-filters";
import IssueMobileFilters from "components/issue-filters/mobile-filters";

export default function IssueFilters({
  onlyTimeFrame = false,
  sortOptions,
  onlyProfileFilters = false,
  chains = []
}) {
  return (
    <>
      {!onlyProfileFilters && (
        <div className="d-none d-xl-flex">
          <IssueDesktopFilters onlyTimeFrame={onlyTimeFrame} />
        </div>
      )}

      <div className="d-flex d-xl-none">
        <IssueMobileFilters
          onlyTimeFrame={onlyTimeFrame}
          sortOptions={sortOptions}
          onlyProfileFilters={onlyProfileFilters}
          chainOptions={chains}
        />
      </div>
    </>
  );
}
