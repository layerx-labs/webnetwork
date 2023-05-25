import If from "components/If";

interface ItemAmountProps {
  amount: string | number;
  label: string;
  currency?: string;
}

export default function ItemAmount({
  amount,
  label,
  currency
} : ItemAmountProps) {
  return(
    <div className="bg-gray-950 py-0 px-2 border-radius-4 border border-gray-800">
      <span className="caption-small font-weight-medium text-white mr-1">
        {amount}
      </span>

      <If condition={!!currency}>
        <span className="caption-small font-weight-medium text-primary mr-1">
          {currency}
        </span>
      </If>

      <span className="caption-small font-weight-medium text-gray-500">
        {label}
      </span>
    </div>
  );
}