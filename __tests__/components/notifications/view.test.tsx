import { render, fireEvent } from "@testing-library/react";

import NotificationsView from "components/notifications/view";

jest.mock("react-bootstrap", () => ({
  OverlayTrigger: ({ children }) => children,
  Popover: ({ children }) => <div>{children}</div>,
}));

const mockUpdateShowOverlay = jest.fn();

jest.mock("components/button", () => ({
  __esModule: true,
  default: jest.fn(({ children }) => (
    <button onClick={mockUpdateShowOverlay}>{children}</button>
  )),
}));

jest.mock("assets/icons/bell-icon", () => ({
  __esModule: true,
  default: () => <div>BellIcon</div>,
}));

jest.mock("components/notifications/list/controller", () => ({
  __esModule: true,
  default: () => <div>NotificationsList</div>,
}));

describe("NotificationsView Component", () => {
  it("should render button correctly", () => {
    const initialState = {
      notificationsList: { rows: [], currentPage: 1, pages: 1, count: 1 },
      updatePage: jest.fn(),
      showOverlay: false,
      updateShowOverlay: jest.fn(),
      loading: false,
      updateNotifications: jest.fn(),
      updateType: jest.fn(),
      typeIsUnread: false,
    };

    const {getByText} = render(<NotificationsView {...initialState} />);

    expect(getByText("BellIcon")).toBeInTheDocument();
  });

  it("should render button and overlay correctly", () => {
    const initialState = {
      notificationsList: { rows: [], currentPage: 1, pages: 1, count: 1 },
      updatePage: jest.fn(),
      showOverlay: false,
      updateShowOverlay: jest.fn(),
      loading: false,
      updateNotifications: jest.fn(),
      updateType: jest.fn(),
      typeIsUnread: false,
    };

    const { getByText } = render(<NotificationsView {...initialState} />);

    // Simulate a button click
    fireEvent.click(getByText("BellIcon"));

    // Ensure that the updateShowOverlay function is called
    expect(mockUpdateShowOverlay).toHaveBeenCalled();
  });
});
