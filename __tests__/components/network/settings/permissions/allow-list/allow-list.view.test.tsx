import { fireEvent } from "@testing-library/react";

import AllowListView from "components/network/settings/permissions/allow-list/allow-list.view";

import { truncateAddress } from "helpers/truncate-address";

import { AllowListTypes } from "interfaces/enums/marketplace";

import { render } from "__tests__/utils/custom-render";

const mockOnTrashClick = jest.fn();
const mockOnValueChange = jest.fn();
const mockOnAddClick = jest.fn();
const type = AllowListTypes.OPEN_TASK;
const allowList = ["0x1234", "0x4321"];
describe("AllowListView", () => {
  it("Should render all items", async () => {
    const result = render(<AllowListView
      value={""}
      onValueChange={mockOnValueChange}
      onAddClick={mockOnAddClick}
      allowList={allowList}
      onTrashClick={mockOnTrashClick}
      error={""}
      type={type}
    />);
    expect(result.getByText(truncateAddress(allowList[0], 10, 8))).toBeDefined();
    expect(result.getByText(truncateAddress(allowList[1], 10, 8))).toBeDefined();
    expect(result.getByTestId(`permission-trash-btn-${allowList[0]}`)).toBeDefined();
    expect(result.getByTestId(`permission-trash-btn-${allowList[1]}`)).toBeDefined();
  });

  it("Should show spinner if list is loading", async () => {
    const result = render(<AllowListView
      value={""}
      onValueChange={mockOnValueChange}
      onAddClick={mockOnAddClick}
      allowList={allowList}
      onTrashClick={mockOnTrashClick}
      error={""}
      type={type}
      isLoading
    />);
    expect(result.getByTestId("allow-list-spinner")).toBeDefined();
  });

  it("Should disable add button if address is empty", async () => {
    const result = render(<AllowListView
      value={""}
      onValueChange={mockOnValueChange}
      onAddClick={mockOnAddClick}
      allowList={allowList}
      onTrashClick={mockOnTrashClick}
      error={""}
      type={type}
    />);
    expect(result.getByTestId("permission-add-button")).toBeDisabled();
  });

  it("Should disable add button if has error", async () => {
    const result = render(<AllowListView
      value={"0x000"}
      onValueChange={mockOnValueChange}
      onAddClick={mockOnAddClick}
      allowList={allowList}
      onTrashClick={mockOnTrashClick}
      error={"not-address"}
      type={type}
    />);
    expect(result.getByTestId("permission-add-button")).toBeDisabled();
  });

  it("Should disable add button if is adding", async () => {
    const result = render(<AllowListView
      value={"0x123"}
      onValueChange={mockOnValueChange}
      onAddClick={mockOnAddClick}
      allowList={allowList}
      onTrashClick={mockOnTrashClick}
      error={""}
      type={type}
      isAdding
    />);
    expect(result.getByTestId("permission-add-button")).toBeDisabled();
  });

  it("Should disable add button if is removing", async () => {
    const result = render(<AllowListView
      value={"0x123"}
      onValueChange={mockOnValueChange}
      onAddClick={mockOnAddClick}
      allowList={allowList}
      onTrashClick={mockOnTrashClick}
      error={""}
      type={type}
      isRemoving
    />);
    expect(result.getByTestId("permission-add-button")).toBeDisabled();
  });

  it("Should disable all remove buttons if is removing", async () => {
    const result = render(<AllowListView
      value={"0x123"}
      onValueChange={mockOnValueChange}
      onAddClick={mockOnAddClick}
      allowList={allowList}
      onTrashClick={mockOnTrashClick}
      error={""}
      type={type}
      isRemoving
    />);
    expect(result.getByTestId(`permission-trash-btn-${allowList[0]}`)).toBeDisabled();
    expect(result.getByTestId(`permission-trash-btn-${allowList[1]}`)).toBeDisabled();
  });

  it("Should call on input change callback", async () => {
    const result = render(<AllowListView
      value={""}
      onValueChange={mockOnValueChange}
      onAddClick={mockOnAddClick}
      allowList={allowList}
      onTrashClick={mockOnTrashClick}
      error={""}
      type={type}
    />);
    const input = result.getByTestId("permission-input");
    fireEvent.change(input, { target: { value: "0x000" } });
    expect(mockOnValueChange).toHaveBeenCalledWith("0x000");
  });

  it("Should call on add click callback", async () => {
    const result = render(<AllowListView
      value={"0x123"}
      onValueChange={mockOnValueChange}
      onAddClick={mockOnAddClick}
      allowList={allowList}
      onTrashClick={mockOnTrashClick}
      error={""}
      type={type}
    />);
    const input = result.getByTestId("permission-input");
    fireEvent.change(input, { target: { value: "0x000" } });
    const button = result.getByTestId("permission-add-button");
    fireEvent.click(button);
    expect(mockOnAddClick).toHaveBeenCalled();
  });

  it("Should call on trash click callback", async () => {
    const result = render(<AllowListView
      value={""}
      onValueChange={mockOnValueChange}
      onAddClick={mockOnAddClick}
      allowList={allowList}
      onTrashClick={mockOnTrashClick}
      error={""}
      type={type}
    />);
    const removeButton = result.getByTestId(`permission-trash-btn-${allowList[0]}`);
    fireEvent.click(removeButton);
    expect(mockOnTrashClick).toHaveBeenCalled();
  });
});