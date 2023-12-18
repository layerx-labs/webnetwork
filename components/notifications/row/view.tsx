import AvatarOrIdenticon from "components/avatar-or-identicon";
import If from "components/If";

import { extractNetworkAndChain } from "helpers/extract-network-and-chain";
import { getTimeDifferenceInWords } from "helpers/formatDate";

import { Notifications } from "interfaces/notifications";

export default  function NotificationRow({
  item,
  key,
  onClickRead,
  redirectTo,
}: {
  item: Notifications;
  key: number;
  redirectTo: (href: string, query) => void;
  onClickRead: (id: number) => void;
}) {
  const className = `h-100 w-100 px-3 py-2 tx-row ${
      key !== 0 && "mt-2 border-top-line"
    } `;
  const regexAvatar = /<div id="avatar">([^<]+)<\/div>/;
  const regexLink = /<div id="link">([^<]+)<\/div>/;
  const extractLink = item?.template?.match(regexLink)?.[1] || null;
  const extractAddress = item?.template?.match(regexAvatar)?.[1] || null;
  const { network, chain, link } = extractNetworkAndChain(extractLink);
  const template = item?.template?.replace("%DATE%",
                                           getTimeDifferenceInWords(new Date(item.createdAt), new Date()));
  const finalTemplate = template?.replace(regexAvatar, '')?.replace(regexLink, '')

  return (
      <div className={className} key={item?.id}>
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-between mt-2">
            <div className="d-flex cursor-pointer" key={item?.id} onClick={() => {
              redirectTo(link, {
                chain: chain, 
                network: network
              })
              if(!item?.read)
                onClickRead(item?.id)
            }}>
              <AvatarOrIdenticon address={extractAddress} size="md" />
              <div dangerouslySetInnerHTML={{ __html: finalTemplate }} />
            </div>
            <div className="d-flex ms-2">
              <If condition={!item?.read}>
                <div
                  className="ball bg-primary cursor-pointer hover-white"
                  onClick={() => onClickRead(item?.id)}
                />
              </If>
            </div>
          </div>
        </div>
      </div>
  );
}