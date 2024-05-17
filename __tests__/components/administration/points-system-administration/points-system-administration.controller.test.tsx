import { fireEvent } from "@testing-library/dom";
import { cleanup } from "@testing-library/react";

import { PointsSystemAdministration } 
  from "components/administration/points-system-administration/points-system-administration.controller";

import { useBulkUpdatePointsBase } from "x-hooks/api/points";

import { render } from "__tests__/utils/custom-render";

jest.mock("x-hooks/api/points", () => ({
  useBulkUpdatePointsBase: jest.fn(),
  useGetPointsBase: jest.fn().mockReturnValue([
    { id: 1, actionName: "action1", scalingFactor: 1, pointsPerAction: 1, counter: "1" },
    { id: 2, actionName: "action2", scalingFactor: 1, pointsPerAction: 1, counter: "1" },
  ])
}))

describe("PointsSystemAdministration", () => {
  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("Should bulk update scalingFactor successfully", async () => {
    const result = render(<PointsSystemAdministration />);

    const scalingFactorInput = result.getByTestId("scaling-factor-input");
    fireEvent.change(scalingFactorInput, { target: { value: "2" } });

    const updateAllButton = result.getByTestId("update-all-button");
    fireEvent.click(updateAllButton);

    expect(useBulkUpdatePointsBase).toHaveBeenCalledWith({
      rows: [
        { id: 1, actionName: "action1", scalingFactor: "2" },
        { id: 2, actionName: "action2", scalingFactor: "2" },
      ]
    });
  });

  it("Should update changed rows successfully", async () => {
    const result = render(<PointsSystemAdministration />);

    const scalingFactorRow1 = result.getByTestId("table-row-0-scalingFactor-input");
    fireEvent.change(scalingFactorRow1, { target: { value: "3" } });

    const counterRow2 = result.getByTestId("table-row-1-counter-input");
    fireEvent.change(counterRow2, { target: { value: "3" } });

    const saveChangesButton = result.getByTestId("save-changes-button");
    fireEvent.click(saveChangesButton);

    expect(useBulkUpdatePointsBase).toHaveBeenCalledWith({
      rows: [
        { id: 1, actionName: "action1", scalingFactor: "3", pointsPerAction: 1, counter: "1" },
        { id: 2, actionName: "action2", scalingFactor: 1, pointsPerAction: 1, counter: "3" },
      ]
    });
  });
});