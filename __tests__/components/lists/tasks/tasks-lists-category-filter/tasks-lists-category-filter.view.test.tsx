import { fireEvent } from "@testing-library/react";

import TasksListsCategoryFilterView
  from "components/lists/tasks/tasks-lists-category-filter/tasks-lists-category-filter.view";

import { render } from "__tests__/utils/custom-render";

const mockOnClick = jest.fn();

const categories: {
  label: string;
  color: string;
  value: "code" | "design" | "marketing"
}[] = [
  {
    label: "code",
    color: "blue",
    value: "code"
  },
  {
    label: "design",
    color: "orange",
    value: "design"
  },
  {
    label: "marketing",
    color: "green",
    value: "marketing"
  }
];
describe("TasksListsCategoryFilterView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should render categories", async () => {
    const result = render(<TasksListsCategoryFilterView categories={categories} onCategoryClick={mockOnClick} />);
    expect(result.getByTestId("category-button-code")).toBeDefined();
    expect(result.getByTestId("category-button-design")).toBeDefined();
    expect(result.getByTestId("category-button-marketing")).toBeDefined();
  });

  it("Should call onClick", async () => {
    const result = render(<TasksListsCategoryFilterView categories={categories} onCategoryClick={mockOnClick} />);
    fireEvent.click(result.getByTestId("category-button-code"));
    expect(mockOnClick).toHaveBeenCalledWith("code");
  });
});