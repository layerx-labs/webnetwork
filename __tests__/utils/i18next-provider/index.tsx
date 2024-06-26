import { ReactNode } from "react"
import { I18nextProvider } from 'react-i18next';

import i18n from 'jest.i18next.mjs';

interface i18NextProviderProps {
  children?: ReactNode;
}

export default function i18NextProviderTests({ children }: i18NextProviderProps) {
  return(
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}