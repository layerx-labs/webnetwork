import { fireEvent } from "@testing-library/react";

import TasksListFilteredCategoriesView
  from "components/lists/tasks/tasks-list-filtered-categories/tasks-list-filtered-categories.view";

import { render } from "__tests__/utils/custom-render";

const mockOnClick = jest.fn();
describe("TasksListFilteredCategoriesView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should return fragment if categories is empty", async () => {
    const categories = [];
    const result = render(<TasksListFilteredCategoriesView categories={categories} onClick={mockOnClick} />);
    expect(() => result.getByTestId("categories-container")).toThrow();
  });

  it("Should render categories", async () => {
    const categories = ["code", "design"];
    const result = render(<TasksListFilteredCategoriesView categories={categories} onClick={mockOnClick} />);
    expect(result.getByTestId("category-button-code")).toBeDefined();
    expect(result.getByTestId("category-button-design")).toBeDefined();
  });

  it("Should call onClick", async () => {
    const categories = ["code", "design"];
    const result = render(<TasksListFilteredCategoriesView categories={categories} onClick={mockOnClick} />);
    fireEvent.click(result.getByTestId("category-button-code"));
    expect(mockOnClick).toHaveBeenCalledWith("code");
  });
});