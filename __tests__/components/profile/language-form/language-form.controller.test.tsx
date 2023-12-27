import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent } from "@testing-library/react";

import LanguageForm from "components/profile/language-form/language-form.controller";

import { mockReplace } from "__mocks__/next/router";
import { useUpdateUserSettings } from "__mocks__/x-hooks/api/user/settings/use-update-settings";
import { mockAddSuccess } from "__mocks__/x-hooks/stores/toasts/toasts.store";

import { render } from "__tests__/utils/custom-render";

const currentUser = {
  walletAddress: "0x0000",
  language: "en"
};

jest.mock("x-hooks/stores/user/user.store", () => ({
  useUserStore: () => ({
    currentUser
  })
}));

describe("LanguageForm", () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    jest.clearAllMocks();
  });

  it("Should show current user language as default option", async () => {
    const result = render(<QueryClientProvider client={queryClient}><LanguageForm /></QueryClientProvider>);
    expect(result.getByText("English")).toBeDefined();
  });

  it("Should have locales from next config as options", async () => {
    const result = render(<QueryClientProvider client={queryClient}><LanguageForm /></QueryClientProvider>);
    const languageSelector = result.getByTestId("language-selector-container").lastChild;
    fireEvent.focus(languageSelector);
    fireEvent.keyDown(languageSelector, {
      key: "ArrowDown",
      code: 40,
    });
    expect(result.queryAllByText("English").length).toBe(2);
    expect(result.getByText("Português")).toBeDefined();
  });

  it("Should change locale", async () => {
    const result = render(<QueryClientProvider client={queryClient}><LanguageForm /></QueryClientProvider>);
    const languageSelector = result.getByTestId("language-selector-container").lastChild;
    fireEvent.focus(languageSelector);
    fireEvent.keyDown(languageSelector, {
      key: "ArrowDown",
      code: 40,
    });
    fireEvent.click(result.getByText("Português"));
    expect(useUpdateUserSettings).toHaveBeenCalledWith({language: "pt" });
    expect(mockReplace).toHaveBeenCalled();
    expect(mockAddSuccess).toHaveBeenCalled();
  });
});