import ArrowUpRight from "assets/icons/arrow-up-right";

import If from "components/If";

import { MINUTE_IN_MS } from "helpers/constants";
import { isValidUrl } from "helpers/validateUrl";

import getMetadata from "x-hooks/api/get-metadata";
import useReactQuery from "x-hooks/use-react-query";

interface OpenGgraphPreviewProps {
  url: string;
  showOpenLink?: boolean;
  previewPlaceholder?: string;
  openLinkText?: string;
}

export default function OpenGraphPreview({
  url,
  showOpenLink,
  previewPlaceholder,
  openLinkText,
}: OpenGgraphPreviewProps) {
  const { data, isFetching } = useReactQuery(["ogPreview", url], () => getMetadata({ url }), {
    enabled: !!url && isValidUrl(url),
    staleTime: MINUTE_IN_MS
  });

  const preview = data?.ogImage || data?.ogVideo;
  const isImage = data?.ogImage ? true : false;

  return(
    <div className="d-flex p-3 flex-column align-items-center border border-radius-4 border-gray-800 comment">
      <If
        condition={!isFetching}
        otherwise={<span className="spinner-border spinner-border m-5" />}
      >
        <If
          condition={isImage}
        >
          
        </If>

        <If
          condition={!!preview}
          otherwise={
            <span className="p-5 sm-regular text-gray-600">
              { previewPlaceholder || "No preview available" }
            </span>
          }
        >
          <If
            condition={isImage}
            otherwise={
              <video src={preview} controls></video>
            }
          >
            <img src={preview} className="border-radius-8" />
          </If>
        </If>

        <If condition={showOpenLink && !!preview}>
          <div className="w-100 text-left mt-3">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferer" 
              className="sm-regular text-decoration-none text-blue-200"
            >
              <span className="mr-1">
                { openLinkText || "View Link" }
              </span>

              <ArrowUpRight />
            </a>
          </div>
        </If>
      </If>
    </div>
  );
}