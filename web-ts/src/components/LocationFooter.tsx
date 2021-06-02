import React from 'react'
import { generatePath } from 'react-router-dom'
import { withTranslation, TFunction } from 'react-i18next'
import Footer from './Footer'
import CleanLink from './CleanLink'
import CleanAnchor from './CleanAnchor'
import buildConfig from '../constants/buildConfig'
import { RoutePatterns } from '../routes/RootSwitcher'
import { DISCLAIMER_ROUTE } from 'api-client'

type PropsType = {
  city: string
  language: string
  t: TFunction
}

export class LocationFooter extends React.PureComponent<PropsType> {
  render() {
    const { t, city, language } = this.props
    const { aboutUrls, privacyUrls } = buildConfig()

    const aboutUrl = aboutUrls[language] || aboutUrls.default
    const privacyUrl = privacyUrls[language] || privacyUrls.default
    const disclaimerPath = generatePath(RoutePatterns[DISCLAIMER_ROUTE], { cityCode: city, languageCode: language })

    return (
      <Footer>
        <CleanLink to={disclaimerPath}>{t('imprintAndContact')}</CleanLink>
        <CleanAnchor href={aboutUrl}>{t('settings:about', { appName: buildConfig().appName })}</CleanAnchor>
        <CleanAnchor href={privacyUrl}>{t('privacy')}</CleanAnchor>
      </Footer>
    )
  }
}

export default withTranslation(['layout', 'settings'])(LocationFooter)