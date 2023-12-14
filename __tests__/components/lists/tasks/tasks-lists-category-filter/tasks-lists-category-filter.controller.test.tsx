import { fireEvent } from "@testing-library/react";

import TasksListsCategoryFilter
  from "components/lists/tasks/tasks-lists-category-filter/tasks-lists-category-filter.controller";

import { useRouter } from "__mocks__/next/router";
import { mockSetValue } from "__mocks__/x-hooks/use-query-filter";

import { render } from "__tests__/utils/custom-render";

describe("TasksListsCategoryFilter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should select a category", async () => {
    const result = render(<TasksListsCategoryFilter />);
    const codeButton = result.getByTestId("category-button-code");
    fireEvent.click(codeButton);
    expect(mockSetValue).toHaveBeenCalledWith({ categories: "code" }, true);
  });

  it("Should select two category", async () => {
    const result = render(<TasksListsCategoryFilter />);
    const codeButton = result.getByTestId("category-button-code");
    fireEvent.click(codeButton);
    expect(mockSetValue).toHaveBeenCalledWith({ categories: "code" }, true);
    useRouter
      .mockReturnValue({
        ...useRouter(),
        query: {
          categories: "code"
        }
      });
    result.rerender(<TasksListsCategoryFilter />);
    const designButton = result.getByTestId("category-button-design");
    fireEvent.click(designButton);
    const firstArgument = mockSetValue.mock.lastCall[0];
    const secondArgument = mockSetValue.mock.lastCall[1];
    expect(firstArgument).toStrictEqual({ categories: "code,design" });
    expect(secondArgument).toBe(true);
  });

  it("Should not select a category because it was already selected", async () => {
    useRouter
      .mockReturnValueOnce({
        ...useRouter(),
        query: {
          categories: "code"
        }
      });
    const result = render(<TasksListsCategoryFilter />);
    const codeButton = result.getByTestId("category-button-code");
    fireEvent.click(codeButton);
    expect(mockSetValue).not.toHaveBeenCalled();
  });
});