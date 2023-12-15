import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, act } from '@testing-library/react';


import Notifications from 'components/notifications/controller';

import { useUpdateReadNotification } from 'x-hooks/api/notification/use-update-read-notification';

import { useRouter } from "__mocks__/next/router";
import { mockInvalidate } from '__mocks__/x-hooks/use-react-query';

jest.mock('x-hooks/api/notification/use-update-read-notification', () => ({
  useUpdateReadNotification: jest.fn(),
}));

jest.mock('x-hooks/api/notifications/use-get-notifications', () => ({
  useGetNotifications: jest.fn(),
}));

const defaultAddress = "0x123456";
const currentUser = {
  walletAddress: defaultAddress
};

jest.mock("x-hooks/stores/user/user.store", () => ({
  useUserStore: () => ({
    currentUser
  })
}));


describe('Notifications component', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    jest.clearAllMocks();
  });

  it('update notifications when navigating from app', async () => {

    render(<QueryClientProvider client={queryClient}><Notifications /></QueryClientProvider>);

    await act(async () => {
      window.dispatchEvent(new Event('popstate'));
    });

    expect(mockInvalidate).toHaveBeenCalled();
  });


  it('updates read status when navigating from an email link', async () => {

    useRouter.mockReturnValueOnce({
      ...useRouter(),
      query: {
        fromEmail: 'id123'
      }
    })

    render(<QueryClientProvider client={queryClient}><Notifications /></QueryClientProvider>);

    expect(useUpdateReadNotification).toHaveBeenCalledWith({
      id: 'id123',
      read: true
    });
  });

});