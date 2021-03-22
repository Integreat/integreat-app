// @flow

import React from 'react'
import landingIcon from '../assets/location-icon.svg'
import Header from './Header'
import HeaderActionItemLink from './HeaderActionItemLink'
import I18nRedirectRouteConfig from '../../app/route-configs/I18nRedirectRouteConfig'
import { withTranslation, type TFunction } from 'react-i18next'
import buildConfig from '../../app/constants/buildConfig'
import type { UiDirectionType } from '../../i18n/types/UiDirectionType'

type PropsType = {|
  direction: UiDirectionType,
  viewportSmall: boolean,
  t: TFunction
|}

const GeneralHeader = ({ viewportSmall, direction, t }: PropsType) => {
  const getPath = new I18nRedirectRouteConfig().getRoutePath

  const actionItems = !buildConfig().featureFlags.fixedCity
    ? [
        <HeaderActionItemLink
          key='landing'
          href={getPath({})}
          iconSrc={landingIcon}
          text={t('changeLocation')}
          direction={direction}
        />
      ]
    : []

  const onStickyTopChanged = () => {}

  return (
    <Header
      viewportSmall={viewportSmall}
      onStickyTopChanged={onStickyTopChanged}
      logoHref={getPath({})}
      actionItems={actionItems}
    />
  )
}

export default withTranslation<PropsType>('layout')(GeneralHeader)
