import { NumberFormatValues } from "react-number-format";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";

import Button from "components/button";
import ContractButton from "components/contract-button";
import InputNumber from "components/input-number";
import Modal from "components/modal";

import { formatStringToCurrency } from "helpers/formatNumber";

import { useERC20 } from "x-hooks/use-erc20";

interface UpdateBountyAmountModalViewProps {
  show: boolean;
  needsApproval: boolean;
  isExecuting: boolean;
  exceedsBalance: boolean;
  newAmount: BigNumber;
  transactionalERC20: useERC20;
  handleChange: (values: NumberFormatValues) => void;
  handleSubmit: () => Promise<void>;
  handleClose: () => void;
  handleApprove: () => void;
}

export default function UpdateBountyAmountModalView({
  show,
  needsApproval,
  isExecuting,
  exceedsBalance,
  newAmount,
  transactionalERC20,
  handleChange,
  handleSubmit,
  handleClose,
  handleApprove,
}: UpdateBountyAmountModalViewProps) {
  const { t } = useTranslation("common");

  return (
    <Modal
      show={show}
      onCloseClick={handleClose}
      title={t("modals.update-bounty-amount.title")}
      titlePosition="center"
      footer={
        <div className="d-flex pt-2 justify-content-between">
          <Button color="dark-gray" onClick={handleClose}>
            {t("actions.cancel")}
          </Button>
          {needsApproval ? (
            <Button
              onClick={handleApprove}
              disabled={isExecuting || exceedsBalance}
              withLockIcon={exceedsBalance}
              isLoading={isExecuting}
            >
              <span>{t("actions.approve")}</span>
            </Button>
          ) : (
            <ContractButton
              disabled={isExecuting || exceedsBalance || !newAmount}
              withLockIcon={exceedsBalance || !newAmount}
              onClick={handleSubmit}
              isLoading={isExecuting}
            >
              <span>{t("actions.confirm")}</span>
            </ContractButton>
          )}
        </div>
      }
    >
      <div className="container">
        <div className="form-group">
          <InputNumber
            label={t("modals.update-bounty-amount.fields.amount.label")}
            max={transactionalERC20.balance.toFixed()}
            error={exceedsBalance}
            value={newAmount?.toFixed()}
            min={0}
            onValueChange={handleChange}
            thousandSeparator
            decimalSeparator="."
            decimalScale={transactionalERC20.decimals}
            helperText={
              <>
                {formatStringToCurrency(transactionalERC20.balance.toFixed())}{" "}
                {transactionalERC20.symbol} {t("misc.available")}
              </>
            }
          />
        </div>
      </div>
    </Modal>
  );
}
