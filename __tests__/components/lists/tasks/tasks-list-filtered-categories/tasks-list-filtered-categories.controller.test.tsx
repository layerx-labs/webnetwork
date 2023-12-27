import { fireEvent } from "@testing-library/react";

import TasksListFilteredCategories
  from "components/lists/tasks/tasks-list-filtered-categories/tasks-list-filtered-categories.controller";

import { useRouter } from "__mocks__/next/router";
import { mockSetValue } from "__mocks__/x-hooks/use-query-filter";

import { render } from "__tests__/utils/custom-render";

describe("TasksListFilteredCategories", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should pass categories from query", async () => {
    useRouter
      .mockReturnValueOnce({
        ...useRouter(),
        query: {
          categories: "code,design"
        }
      });
    const result = render(<TasksListFilteredCategories />);
    expect(result.getByTestId("category-button-code")).toBeDefined();
    expect(result.getByTestId("category-button-design")).toBeDefined();
  });

  it("Should remove a category", async () => {
    useRouter
      .mockReturnValueOnce({
        ...useRouter(),
        query: {
          categories: "code,design"
        }
      });
    const result = render(<TasksListFilteredCategories />);
    const codeButton = result.getByTestId("category-button-code");
    fireEvent.click(codeButton);
    expect(mockSetValue).toHaveBeenCalledWith({ categories: "design", page: "1" }, true);
  });
});