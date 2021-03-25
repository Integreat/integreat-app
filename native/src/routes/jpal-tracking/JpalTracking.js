// @flow

import React, { useEffect, useMemo, useState } from 'react'

import type { ThemeType } from 'build-configs/ThemeType'
import { Switch, Text, TextInput, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import type { StateType } from '../../modules/app/StateType'
import AppSettings, { defaultSettings } from '../../modules/settings/AppSettings'
import type { NavigationPropType, RoutePropType } from '../../modules/app/constants/NavigationTypes'
import type { JpalTrackingRouteType } from 'api-client'
import styled from 'styled-components/native'
import LayoutContainer from '../../modules/layout/containers/LayoutContainer'
import withTheme from '../../modules/theme/hocs/withTheme'
import Caption from '../../modules/common/components/Caption'

const ThemedText = styled.Text`
  display: flex;
  text-align: left;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
  padding: 10px 0;
`

const ErrorText = styled.Text`
  color: red;
  font-weight: bold;
  padding: 10px 0;
`

const DescriptionContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 15px 0 5px;
`

const Input = styled(TextInput)`
  padding: 15px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.themeColor};
  text-align-vertical: top;
  height: 50px;
`

export type PropsType = {|
  theme: ThemeType,
  route: RoutePropType<JpalTrackingRouteType>,
  navigation: NavigationPropType<JpalTrackingRouteType>
|}

const errorDisplayTime = 5000

const JpalTracking = (props: PropsType, state: StateType) => {
  const appSettings = useMemo(() => new AppSettings(), [])
  const [settings, setSettings] = useState(defaultSettings)
  const [settingsLoaded, setSettingsLoaded] = useState(false)
  const [settingsUpdated, setSettingsUpdated] = useState(false)
  const [displayedTrackingCode, setDisplayedTrackingCode] = useState('')
  const [displayedTrackingEnabled, setDisplayedTrackingEnabled] = useState(false)
  const [error, setError] = useState(false)
  const routeTrackingCode = props.route.params.trackingCode

  const { t } = useTranslation(['settings', 'error'])

  useEffect(() => {
    if (routeTrackingCode) {
      appSettings.setJpalTrackingCode(routeTrackingCode)
    }
  }, [appSettings, routeTrackingCode])

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const loadedSettings = await appSettings.loadSettings()
        setSettingsLoaded(true)
        setSettingsUpdated(false)
        setSettings(loadedSettings)
        setDisplayedTrackingCode(loadedSettings.jpalTrackingCode)
        setDisplayedTrackingEnabled(loadedSettings.jpalTrackingEnabled)
        setTimeout(() => setError(false), errorDisplayTime)
      } catch (e) {
        // setError(true)
      }
    }
    loadSettings()
  }, [appSettings, settingsUpdated])

  const toggleTrackingEnabled = () => {
    setDisplayedTrackingEnabled(!displayedTrackingEnabled)
    appSettings.setJpalTrackingEnabled(!settings.jpalTrackingEnabled).catch(() => {
      setError(true)
      setSettingsUpdated(true)
    })
  }

  const setTrackingCode = (value: string) => {
    setDisplayedTrackingCode(value)
    appSettings.setJpalTrackingCode(value).catch(() => {
      setError(true)
      setSettingsUpdated(true)
    })
    props.navigation.setParams({ trackingCode: value })
  }

  if (!settingsLoaded) {
    return <LayoutContainer />
  }

  const { theme } = props

  return (
    <View style={{ padding: 40 }}>
      <Caption title={t('tracking')} theme={theme} />
      <Text>{t('trackingDescription')}</Text>

      {error && <ErrorText>{t('error:generalError')}</ErrorText>}

      <DescriptionContainer>
        <ThemedText theme={props.theme}>{t('allowTracking')}</ThemedText>
        <Switch
          thumbColor={props.theme.colors.themeColor}
          trackColor={{ true: props.theme.colors.themeColor }}
          value={displayedTrackingEnabled}
          onValueChange={toggleTrackingEnabled}
          testID='switch'
        />
      </DescriptionContainer>

      <ThemedText theme={props.theme}>{t('trackingCode')}</ThemedText>
      <Input
        value={displayedTrackingCode}
        onChangeText={setTrackingCode}
        theme={theme}
        editable={displayedTrackingEnabled}
        testID='input'></Input>
    </View>
  )
}

export default withTheme<PropsType>(JpalTracking)