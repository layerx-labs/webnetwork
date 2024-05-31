import ArrowUpRight from "../../assets/icons/arrow-up-right";

type AnchorLinkProps = {
  label: string;
  url: string;
  dataTestId: string;
}

export const AnchorLink = ({label, url, dataTestId = ""}: AnchorLinkProps) => (
  <a href={url}
     target="_blank"
     rel="noopener noreferer"
     className="sm-regular text-decoration-none text-blue-200"
     data-testid={dataTestId}>
      <span className="mr-1">
        {label}
      </span>
    <ArrowUpRight/>
  </a>
);