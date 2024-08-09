import { Modal as ModalBootstrap } from "react-bootstrap";

import CloseIcon from "assets/icons/close-icon";

import Button from "components/button";
import If from "components/If";

import { kebabCase } from "helpers/string";

import { Modal as ModalProps } from "types/modal";

import useBreakPoint from "x-hooks/use-breakpoint";

export default function Modal({
  title = "",
  centerTitle = true,
  subTitle = "",
  key,
  children = null,
  footer = null,
  onCloseClick,
  onCloseDisabled = false,
  backdrop = "static",
  titleClass,
  okLabel = "",
  cancelLabel = "",
  onOkClick,
  titleComponent,
  subTitleComponent,
  okDisabled = false,
  okColor = "primary",
  isExecuting = false,
  ...params
}: ModalProps) {
  const { isMobileView } = useBreakPoint();

  if (!params.show)
    return <></>;

  const modalTitle = `${kebabCase(key || title)}-modal`;

  function renderFooter() {
    if (footer) return footer;
    if (okLabel || cancelLabel)
      return (
        <div className="row justify-content-between justify-content-lg-end px-0 gap-3 mt-5">
          <If condition={!!cancelLabel}>
            <div className="col-5 col-md-auto">
              <div className="row">
                <Button
                  color="gray-800"
                  className={`border-radius-4 border border-gray-700 sm-regular text-capitalize font-weight-medium 
                  py-2 px-3`}
                  onClick={onCloseClick}
                  disabled={onCloseDisabled || isExecuting}
                  data-testid={cancelLabel}
                >
                  <span>{cancelLabel}</span>
                </Button>
              </div>
            </div>
          </If>

          <If condition={!!okLabel}>
            <div className="col-5 col-md-auto">
             <div className="row">
               <Button
                 color={okColor}
                 className={`border-radius-4 border border-${okDisabled || isExecuting ? "gray-700" : "primary"} 
                  sm-regular text-capitalize font-weight-medium py-2 px-3`}
                 onClick={onOkClick}
                 disabled={okDisabled || isExecuting}
                 data-testid={okLabel}
                 isLoading={isExecuting}
               >
                 <span>{okLabel}</span>
               </Button>
             </div>
            </div>
          </If>
        </div>
      );
    return <></>;
  }

  return (
    <ModalBootstrap
      centered
      onEscapeKeyDown={onCloseClick}
      onHide={onCloseClick}
      aria-labelledby={modalTitle}
      aria-describedby={modalTitle}
      id={modalTitle}
      backdrop={backdrop}
      fullscreen={isMobileView as string | true}
      {...params}
    >
      <ModalBootstrap.Header
        className={`row mb-4 align-items-center ${
          centerTitle || isMobileView ? "text-center" : ""
        } text-break`}
      >
        <div className="col mb-1">
          <div className="row align-items-center">
            <ModalBootstrap.Title
              className={`col text-white xl-medium ${titleClass || ""}`}
            >
              <h4>{titleComponent || title}</h4>
            </ModalBootstrap.Title>

            {onCloseClick && (
              <div className="col-auto">
                <Button
                  color="gray-800"
                  className="p-1 text-gray-300 border border-gray-700 not-svg"
                  onClick={onCloseClick}
                  disabled={isExecuting||onCloseDisabled}
                >
                  <CloseIcon width={12} height={12} />
                </Button>
              </div>
            )}
          </div>

          <If condition={!!subTitle || !!subTitleComponent}>
            <div className="row mt-3">
              <div className="col">
                <span className="base-medium text-gray-400">
                  {subTitleComponent || subTitle }
                </span>
              </div>
            </div>
          </If>
        </div>
      </ModalBootstrap.Header>
      <ModalBootstrap.Body>{children}</ModalBootstrap.Body>
      <ModalBootstrap.Footer className="row mx-0">{renderFooter()}</ModalBootstrap.Footer>
    </ModalBootstrap>
  );
}
