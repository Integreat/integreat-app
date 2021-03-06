import React from 'react'
import { render } from '@testing-library/react'
import { CATEGORIES_ROUTE } from 'api-client'
import { LocationLayout, ToolbarPropType } from '../LocationLayout'
import { ThemeProvider } from 'styled-components'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import buildConfig from '../../constants/buildConfig'

jest.mock('../LocationFooter', () => {
  return () => <div>LocationFooter</div>
})
jest.mock('../LocationHeader', () => {
  return () => <div>LocationHeader</div>
})

describe('LocationLayout', () => {
  const language = 'de'
  const cityModel = new CityModelBuilder(1).build()[0]

  const languageChangePaths = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de' },
    { code: 'en', name: 'English', path: '/augsburg/en' }
  ]

  const feedbackTargetInformation = { path: '/path/to/category' }
  const theme = buildConfig().lightTheme

  const MockNode = () => <div />
  const renderLocationLayout = (pathname: string, isLoading: boolean, toolbar?: ToolbarPropType) => (
    <LocationLayout
      toolbar={toolbar}
      cityModel={cityModel}
      languageCode={language}
      pathname={pathname}
      route={CATEGORIES_ROUTE}
      languageChangePaths={languageChangePaths}
      feedbackTargetInformation={feedbackTargetInformation}
      viewportSmall
      isLoading={isLoading}>
      <MockNode />
    </LocationLayout>
  )

  it('should render a toolbar', () => {
    const pathname = '/augsburg/de/events'
    const toolbar = () => 'LocationToolbar'

    const { getByText } = render(
      <ThemeProvider theme={theme}>{renderLocationLayout(pathname, false, toolbar)}</ThemeProvider>
    )
    expect(getByText('LocationToolbar')).toBeTruthy()
  })

  it('should show LocationHeader and LocationFooter if not loading', () => {
    const pathname = '/augsburg/de/willkommen'

    const { getByText } = render(<ThemeProvider theme={theme}>{renderLocationLayout(pathname, false)}</ThemeProvider>)
    expect(getByText('LocationHeader')).toBeTruthy()
    expect(getByText('LocationFooter')).toBeTruthy()
  })

  it('should not render LocationFooter if loading', () => {
    const pathname = '/augsburg/de/willkommen'

    const { getByText } = render(<ThemeProvider theme={theme}>{renderLocationLayout(pathname, true)}</ThemeProvider>)
    expect(getByText('LocationHeader')).toBeTruthy()
    expect(() => getByText('LocationFooter')).toThrow()
  })
})
