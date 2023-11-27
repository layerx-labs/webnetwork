import {ReactElement} from 'react'

import {render, RenderOptions} from '@testing-library/react'

import i18NextProviderTests from "__tests__/utils/i18next-provider";

const customRender = (ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,) => render(ui, {wrapper: i18NextProviderTests, ...options});

export {customRender as render}