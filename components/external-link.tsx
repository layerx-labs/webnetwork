import ExternalLinkIcon from "assets/icons/external-link-icon";

export function ExternalLink({ label, href }) {
  return(
    <div className={`d-flex flex-row align-items-center justify-content-center mt-1 gap-2 text-blue-200`} key={label}>
      <a
        href={href}
        className={`text-decoration-none p family-Regular text-blue-200`}
        target="_blank"
      >
        {label}
      </a>
      <ExternalLinkIcon width={12} height={12} />
  </div>
  );
}