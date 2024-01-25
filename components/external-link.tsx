import ExternalLinkIcon from "assets/icons/external-link-icon";

interface ExternalLinkProps {
  label: string;
  href: string;
  align?: "start" | "center" | "end";
}
export function ExternalLink({ label, href, align = "center" }: ExternalLinkProps) {
  return(
    <div className={`d-flex flex-row align-items-center justify-content-${align} mt-1 gap-2 text-blue-200`} key={label}>
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