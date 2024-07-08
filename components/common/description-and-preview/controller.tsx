import DescriptionAndPreviewView from "components/common/description-and-preview/view";

interface DescriptionProps {
  description: string;
  handleChangeDescription: (value: string) => void;
  borderColor?: string;
}

export default function DescriptionAndPreview({
  handleChangeDescription,
  description,
  borderColor,
}: DescriptionProps) {

  return (
    <DescriptionAndPreviewView
      description={description}
      handleChangeDescription={handleChangeDescription}
      borderColor={borderColor}
    />
  );
}
