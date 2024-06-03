import { Col, Row } from "react-bootstrap";

import { useTranslation } from "next-i18next";

import Button from "components/button";
import ThemeColors from "components/custom-network/theme-colors";
import If from "components/If";
import ImageUploader from "components/image-uploader";
import NetworkTabContainer from "components/network/settings/tab-container/view";
import { ResponsiveEle } from "components/responsive-wrapper";

import { formatDate } from "helpers/formatDate";

import { Color, Field, Icon, Network, Theme } from "interfaces/network";

interface NetworkLogoAndColorsSettingsViewProps {
  baseUrl: string;
  network: Network;
  networkTheme: Theme;
  iconLogoField: Field<Icon>;
  fullLogoField: Field<Icon>;
  isLogosSizeTooLarge?: boolean;
  isSaveChangesButtonDisabled?: boolean;
  isSavingChanges?: boolean;
  queryableNetworkName: string;
  hasChanges: boolean;
  onColorChange: (value: Color) => void;
  onIconLogoChange: (value: Icon) => void;
  onFullLogoChange: (value: Icon) => void;
  onSaveChangesClick: () => void;
}

export default function NetworkLogoAndColorsSettingsView({
  baseUrl,
  network,
  networkTheme,
  iconLogoField,
  fullLogoField,
  isLogosSizeTooLarge,
  isSaveChangesButtonDisabled,
  isSavingChanges,
  queryableNetworkName,
  hasChanges,
  onColorChange,
  onIconLogoChange,
  onFullLogoChange,
  onSaveChangesClick,
}: NetworkLogoAndColorsSettingsViewProps) {
  const { t } = useTranslation(["common", "custom-network"]);

  const SaveButton = (
    <Button
      isLoading={isSavingChanges}
      disabled={isSaveChangesButtonDisabled}
      onClick={onSaveChangesClick}
    >
      Save Changes
    </Button>
  );

  return (
    <NetworkTabContainer>
      <Row className="align-items-start mt-4 gy-3 gap-xl-0">
        <Col xs={12} md={4} lg={4}>
          <Row>
            <h3 className="text-capitalize family-Regular text-white overflow-wrap-anywhere">
              {network?.name}
            </h3>
          </Row>

          <Row className="mb-2 mt-4">
            <span className="caption-small font-weight-medium text-gray-400">
              {t("custom-network:query-url")}
            </span>
          </Row>

          <Row className="mb-2">
            <span className="caption-large font-weight-medium overflow-wrap-anywhere">
              <span className="text-white">
                {baseUrl}/
              </span>

              <span className="text-primary">
                {queryableNetworkName || t("custom-network:steps.network-information.fields.name.default")}
              </span>
            </span>
          </Row>

          <Row className="mb-2 mt-4">
            <span className="caption-small font-weight-medium text-gray-400">
              {t("misc.creation-date")}
            </span>
          </Row>

          <Row>
            <span className="caption-large font-weight-medium text-white">
              {formatDate(network?.createdAt, "-")}
            </span>
          </Row>
        </Col>

        <Col xs={12} md={6}>
          <Row className="gy-3">
            <Col xs="auto">
              <ImageUploader
                name="logoIcon"
                value={iconLogoField?.value}
                isLoading={!iconLogoField?.value?.preview}
                className="bg-shadow"
                error={iconLogoField?.validated === false}
                onChange={onIconLogoChange}
                description={
                  <>
                    {t("misc.upload")} <br />{" "}
                    {t("custom-network:steps.network-information.fields.logo-icon.label")}
                  </>
                }
              />
            </Col>

            <Col xs="auto">
              <ImageUploader
                name="fullLogo"
                value={fullLogoField?.value}
                isLoading={!fullLogoField?.value?.preview}
                className="bg-shadow"
                error={fullLogoField?.validated === false}
                onChange={onFullLogoChange}
                description={`
                  ${t("misc.upload")} ${t("custom-network:steps.network-information.fields.full-logo.label")}
                `}
                lg
              />
              </Col>
          </Row>
        </Col>

        <If condition={hasChanges}>
          <ResponsiveEle
            className="col"
            tabletView={SaveButton}
          />
        </If>
      </Row>

      <If condition={isLogosSizeTooLarge}>
        <Row className="mb-2 justify-content-center">
          <Col xs="auto">
              <small className="text-danger small-info mt-1">
                {t("custom-network:errors.images-too-big")}
              </small>
          </Col>
        </Row>
      </If>

      <Row className="mt-4">
        <Col className="mt-4">
          <span className="caption-medium font-weight-medium text-white mb-3">
            {t("custom-network:steps.network-settings.fields.colors.label")}
          </span>

          <ThemeColors
            colors={networkTheme?.colors}
            setColor={onColorChange}
          />
        </Col>
      </Row>

      <If condition={hasChanges}>
        <ResponsiveEle
          mobileView={
            <Row className="mx-0">
              {SaveButton}
            </Row>
          }
          tabletView={null}
        />
      </If>
    </NetworkTabContainer>
  );
}