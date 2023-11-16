import Badge from "components/badge";

interface BountyTagsProps {
  tags: string[];
}

export default function BountyTagsView({
  tags
}: BountyTagsProps) {
  if (!tags) return <></>;

  return (
    <div className="d-flex flex-wrap gap-1">
      {tags.map((tag) => (
        <Badge
          key={tag}
          label={tag}
          className={`border border-gray-800 px-2 py-1 border-radius-4 sm-regular text-uppercase 
            text-truncate text-gray-500`}
          color="transparent"
        />
      ))}
    </div>
  );
}