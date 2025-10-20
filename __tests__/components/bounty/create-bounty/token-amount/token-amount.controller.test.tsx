import { NumberFormatValues } from "react-number-format";

import { toSmartContractDecimals } from "@taikai/dappkit/dist/src/utils/numbers";
import { fireEvent } from "@testing-library/dom";
import BigNumber from "bignumber.js";

import CreateBountyTokenAmount, {
  ZeroNumberFormatValues,
} from "components/bounty/create-bounty/token-amount/controller";

import { Network } from "interfaces/network";
import { DistributionsProps } from "interfaces/proposal";
import { Token } from "interfaces/token";

import { render } from "__tests__/utils/custom-render";

jest.mock("x-hooks/use-bepro", () => () => ({}));

const mockCurrentToken: Token = {
  address: "0x1234567890123456789012345678901234567890",
  name: "Mock Token",
  symbol: "MOCK",
};

const mockCurrentNetwork: Network = {
  id: 1,
  name: "Mock Network",
  updatedAt: new Date(),
  createdAt: new Date(),
  description: "Mock Description",
  networkAddress: "0x1234567890123456789012345678901234567890",
  creatorAddress: "0x1234567890123456789012345678901234567890",
  openBounties: 0,
  totalBounties: 0,
  allowCustomTokens: false,
  councilMembers: [],
  banned_domains: [],
  closeTaskAllowList: [],
  allow_list: [],
  mergeCreatorFeeShare: 0.05,
  proposerFeeShare: 0.5,
  chain: {
    chainId: 1,
    chainRpc: "https://mock-rpc.com",
    name: "Mock Chain",
    chainName: "Mock Chain",
    chainShortName: "MOCK",
    chainCurrencySymbol: "MOCK",
    chainCurrencyDecimals: "18",
    chainCurrencyName: "Mock Token",
    blockScanner: "https://mock-scanner.com",
    registryAddress: "0x1234567890123456789012345678901234567890",
    eventsApi: "https://mock-events.com",
    isDefault: true,
    closeFeePercentage: 10,
    cancelFeePercentage: 1.0,
    networkCreationFeePercentage: 0.5,
  },
};

describe("TokenAmountController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fuzzes total input and ensures internal adjusted total is divisible by 100 in contract units", () => {
    let executions = 0;

    let issueAmount = ZeroNumberFormatValues;
    let previewAmount = ZeroNumberFormatValues;

    const setPreviewAmount = jest.fn((value: NumberFormatValues) => {
      previewAmount = value;
    });
    const updateIssueAmount = jest.fn((value: NumberFormatValues) => {
      issueAmount = value;
    });

    while (executions < 100) {
      const decimals = Math.floor(Math.random() * 13) + 6;
      const randomValue = parseFloat((Math.random() * 499999 + 1).toFixed(decimals));

      const result = render(<CreateBountyTokenAmount
        currentToken={mockCurrentToken}
        updateCurrentToken={jest.fn()}
        addToken={jest.fn()}
        canAddCustomToken={true}
        defaultToken={mockCurrentToken}
        userAddress="0x1234567890123456789012345678901234567890"
        customTokens={[]}
        tokenBalance={new BigNumber(1)}
        issueAmount={issueAmount}
        updateIssueAmount={updateIssueAmount}
        isFunders={true}
        decimals={decimals}
        isFunding={false}
        needValueValidation={false}
        previewAmount={previewAmount}
        distributions={{} as DistributionsProps}
        currentNetwork={mockCurrentNetwork}
        setPreviewAmount={setPreviewAmount}
        setDistributions={jest.fn()}
        sethasAmountError={jest.fn()}
      />);
      
      const totalAmountInput = result.getAllByTestId("total-amount-input")[0];

      const valueString = randomValue.toString();

      fireEvent.change(totalAmountInput, { target: { value: valueString } });

      result.rerender(<CreateBountyTokenAmount
        currentToken={mockCurrentToken}
        updateCurrentToken={jest.fn()}
        addToken={jest.fn()}
        canAddCustomToken={true}
        defaultToken={mockCurrentToken}
        userAddress="0x1234567890123456789012345678901234567890"
        customTokens={[]}
        tokenBalance={new BigNumber(1)}
        issueAmount={issueAmount}
        updateIssueAmount={updateIssueAmount}
        isFunders={true}
        decimals={decimals}
        isFunding={false}
        needValueValidation={false}
        previewAmount={previewAmount}
        distributions={{} as DistributionsProps}
        currentNetwork={mockCurrentNetwork}
        setPreviewAmount={setPreviewAmount}
        setDistributions={jest.fn()}
        sethasAmountError={jest.fn()}
      />);

      const newValueContract = toSmartContractDecimals(issueAmount.value, decimals);

      expect(Number(BigInt(newValueContract) % BigInt(100))).toBe(0);

      jest.clearAllMocks();
      result.unmount();

      executions += 1;
    }
  });
});
