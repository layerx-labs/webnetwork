import {SetStateAction} from "react";
import {Col} from "react-bootstrap";

import {useTranslation} from "next-i18next";
import { isAddress } from "web3-utils";

import ContractButton from "components/common/buttons/contract-button/contract-button.controller";
import {ExternalLink} from "components/external-link";
import {FormGroup} from "components/form-group";

import { useDaoStore } from "x-hooks/stores/dao/dao.store";

export interface ContractField {
  value: string;
  validated: boolean|null;
}

interface ContractInputProps {
  field: ContractField;
  contractName: string;
  validator?: string;
  onChange?: (value: SetStateAction<ContractField>) => void;
  docsLink: string;
  readOnly?: boolean;
  mustBeAddress?: boolean;
  decimalScale?: number;
  action?: {
    disabled: boolean;
    executing: boolean;
    label: string;
    onClick: () => void;
  };
}

export function ContractInput({
  field,
  onChange,
  contractName,
  docsLink,
  action,
  validator,
  readOnly,
  mustBeAddress
} : ContractInputProps) {
  const { t } = useTranslation(["common", "setup"]);
  const { service: daoService } = useDaoStore();

  function isInvalid(validated, name) {
    return validated === false ? t("setup:registry.errors.invalid-contract-address", { contract: name }) : "";
  }

  function handleChange(value: string) {
    onChange?.(previous => ({ ...previous, value}));
  }

  function validateContractField() {

    const { value } = field;

    if (mustBeAddress)
      return onChange(previous =>
        ({ ...previous, validated: value?.trim().length ? isAddress(field?.value) : null }));

    if (!validator)
      return;

    if (!daoService || value.trim() === "") 
      return onChange(previous => ({ ...previous, validated: null }));

    if (!isAddress(value))
      return onChange(previous => ({ ...previous, validated: false }));

    daoService[validator](value)
      .then(loaded => onChange(previous => ({ ...previous, validated: !!loaded })));
  }

  return(
    <>
      <FormGroup
          label={contractName}
          placeholder={t("setup:registry.fields.contract-field.placeholder", { contract: contractName })}
          value={field.value}
          onChange={handleChange}
          readOnly={readOnly}
          onBlur={validateContractField}
          error={isInvalid(field.validated, contractName)}
          hint={
            <ExternalLink
              label={t("setup:registry.fields.contract-field.hint", { contract: contractName })}
              href={docsLink}
              align={"start"}
            />
          }
        />

        { action && 
          <Col xs="auto">
            <ContractButton
              disabled={action.disabled} 
              withLockIcon={action.disabled || action.executing}
              isLoading={action.executing}
              onClick={action.onClick}
              variant="registry"
            >
              <span>{action.label}</span>
            </ContractButton>
          </Col>
        }
    </>
  );
}