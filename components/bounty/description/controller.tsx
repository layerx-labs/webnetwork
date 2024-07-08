import BountyDescriptionView from "./view";

interface DescriptionProps {
  body: string;
  setBody?: (v: string) => void;
  isEdit?: boolean;
}

export default function BountyDescription({
  body,
  setBody,
  isEdit = false,
}: DescriptionProps) {
  function handleChangeBody(value: string) {
    setBody(value);
  }

  return (
    <BountyDescriptionView
      body={body}
      handleChangeBody={handleChangeBody}
      isEdit={isEdit}
    />
  );
}
