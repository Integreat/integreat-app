// @flow

import createSettingsSections from '../createSettingsSections'
import createNavigationScreenPropMock from '../../../testing/createNavigationPropMock'
import { defaultSettings } from '../../../modules/settings/AppSettings'
import buildConfig from '../../../modules/app/constants/buildConfig'
import type { SettingsType } from '../../../modules/settings/AppSettings'
import { openSettings } from 'react-native-permissions'

jest.mock('../../../modules/native-constants/NativeConstants', () => ({ appVersion: '1.0.0' }))

let mockRequestPushNotificationPermission
let mockSubscribeNews
let mockUnsubscribeNews
jest.mock('../../../modules/push-notifications/PushNotificationsManager', () => {
  const requestPushNotificationPermission = jest.fn()
  const subscribeNews = jest.fn()
  const unsubscribeNews = jest.fn()
  mockRequestPushNotificationPermission = requestPushNotificationPermission
  mockSubscribeNews = subscribeNews
  mockUnsubscribeNews = unsubscribeNews
  return {
    requestPushNotificationPermission,
    subscribeNews,
    unsubscribeNews
  }
})

jest.mock('react-native-permissions', () => require('react-native-permissions/mock'))
jest.mock('@react-native-community/geolocation')
jest.mock('../../../modules/app/initSentry')

describe('createSettingsSections', () => {
  let changeSetting: (settings: SettingsType) => $Shape<SettingsType>
  let changeAction: void | ((newSettings: SettingsType) => Promise<void>)

  beforeEach(() => {
    jest.clearAllMocks()
    changeSetting = settings => settings
    changeAction = async () => {}
  })

  const setSetting = async (newChangeSetting, newChangeAction) => {
    changeSetting = newChangeSetting
    changeAction = newChangeAction
  }
  const t = key => key
  const languageCode = 'de'
  const cityCode = 'augsburg'
  const navigation = createNavigationScreenPropMock()

  const createSettings = () =>
    createSettingsSections({
      t,
      languageCode,
      cityCode,
      navigation,
      setSetting,
      settings: defaultSettings
    })[0].data

  const mockBuildConfig = (pushNotifications: boolean) => {
    const previous = buildConfig()
    // $FlowFixMe flow is not aware that buildConfig is a mock funciton
    buildConfig.mockImplementation(() => ({
      ...previous,
      featureFlags: { ...previous.featureFlags, pushNotifications }
    }))
  }

  describe('allowPushNotifications', () => {
    it('should not include push notification setting if disabled in build config', () => {
      mockBuildConfig(false)
      const sections = createSettings()
      expect(sections.find(it => it.title === 'privacyPolicy')).toBeTruthy()
      expect(sections.find(it => it.title === 'pushNewsTitle')).toBeFalsy()
    })

    it('should set correct setting on press', () => {
      mockBuildConfig(true)
      const sections = createSettings()
      const pushNotificationSection = sections.find(it => it.title === 'pushNewsTitle')

      // Initialize changeSetting and changeAction
      pushNotificationSection?.onPress()

      const settings = defaultSettings
      settings.allowPushNotifications = false
      const changedSettings = changeSetting(settings)

      // $FlowFixMe
      expect(pushNotificationSection.getSettingValue(settings)).toBeFalse()
      expect(changedSettings.allowPushNotifications).toBeTrue()

      settings.allowPushNotifications = true
      const changedSettings2 = changeSetting(settings)

      // $FlowFixMe
      expect(pushNotificationSection.getSettingValue(settings)).toBeTrue()
      expect(changedSettings2.allowPushNotifications).toBeFalse()
    })

    it('should unsubscribe from push notification topic', async () => {
      mockBuildConfig(true)
      const sections = createSettings()
      const pushNotificationSection = sections.find(it => it.title === 'pushNewsTitle')

      // Initialize changeSetting and changeAction
      pushNotificationSection?.onPress()

      const newSettings = defaultSettings
      newSettings.allowPushNotifications = false

      if (!changeAction) {
        expect(false).toBeTrue()
      } else {
        expect(mockUnsubscribeNews).not.toHaveBeenCalled()

        await changeAction(newSettings)

        expect(mockUnsubscribeNews).toHaveBeenCalledTimes(1)
        expect(mockUnsubscribeNews).toHaveBeenCalledWith(cityCode, languageCode)
        expect(mockSubscribeNews).not.toHaveBeenCalled()
        expect(mockRequestPushNotificationPermission).not.toHaveBeenCalled()
      }
    })

    it('should subscribe to push notification topic if permission is granted', async () => {
      mockBuildConfig(true)
      const sections = createSettings()
      const pushNotificationSection = sections.find(it => it.title === 'pushNewsTitle')

      // Initialize changeSetting and changeAction
      pushNotificationSection?.onPress()

      const newSettings = defaultSettings
      newSettings.allowPushNotifications = true

      if (!changeAction) {
        expect(false).toBeTrue()
      } else {
        expect(mockRequestPushNotificationPermission).not.toHaveBeenCalled()
        expect(mockSubscribeNews).not.toHaveBeenCalled()
        mockRequestPushNotificationPermission.mockImplementationOnce(async () => true)

        await changeAction(newSettings)

        expect(mockRequestPushNotificationPermission).toHaveBeenCalledTimes(1)
        expect(mockSubscribeNews).toHaveBeenCalledTimes(1)
        expect(mockSubscribeNews).toHaveBeenCalledWith(cityCode, languageCode)
        expect(mockUnsubscribeNews).not.toHaveBeenCalled()
      }
    })

    it('should open settings and throw if permissions not granted', async () => {
      mockBuildConfig(true)
      const sections = createSettings()
      const pushNotificationSection = sections.find(it => it.title === 'pushNewsTitle')

      // Initialize changeSetting and changeAction
      pushNotificationSection?.onPress()

      const newSettings = defaultSettings
      newSettings.allowPushNotifications = true

      if (!changeAction) {
        expect(false).toBeTrue()
      } else {
        expect(mockRequestPushNotificationPermission).not.toHaveBeenCalled()
        expect(mockSubscribeNews).not.toHaveBeenCalled()
        mockRequestPushNotificationPermission.mockImplementationOnce(async () => false)

        await expect(changeAction(newSettings)).rejects.toThrowError()

        expect(mockRequestPushNotificationPermission).toHaveBeenCalledTimes(1)
        expect(openSettings).toHaveBeenCalledTimes(1)

        expect(mockSubscribeNews).not.toHaveBeenCalled()
        expect(mockUnsubscribeNews).not.toHaveBeenCalled()
      }
    })
  })
})