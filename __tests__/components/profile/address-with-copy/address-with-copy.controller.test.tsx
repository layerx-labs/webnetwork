import React from "react";

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CopyIcon from "assets/icons/copy-icon";

import AddressWithCopy from "components/profile/address-with-copy/controller";

import { render } from "__tests__/utils/custom-render";

// Mock CopyButton component
jest.mock('components/common/buttons/copy/controller', () => {
  return {
      __esModule: true,
      default: jest.fn(({ onClick }) => (
        <button data-testid="copyButton" onClick={onClick}>
          <CopyIcon />
        </button>
      )),
  };
});

describe("AddressWithCopy", () => {
  it("renders address correctly", () => {
    const address = "0x13559385861e3fb28856936805a3c2f8a52dd38a";
    const textClass = "caption-medium";

    render(<AddressWithCopy address={address} textClass={textClass} />);

    // Check if the address is rendered correctly
    const renderedAddress = screen.getByText(address);
    expect(renderedAddress).toBeInTheDocument();

    // Check if CopyButton is rendered
    const copyButton = screen.getByTestId("copyButton");
    expect(copyButton).toBeInTheDocument();
  });

  it('truncates address when "truncated" prop is true', () => {
    const address = "0x13559385861e3fb28856936805a3c2f8a52dd38a";
    const truncatedAddress = "0x1355...d38a";

    render(<AddressWithCopy
        address={address}
        textClass="caption-medium"
        truncated={true}
      />);

    // Check if truncated address is rendered
    const renderedAddress = screen.getByText(truncatedAddress);
    expect(renderedAddress).toBeInTheDocument();
  });
});
