import { Dispatch } from 'redux'
import { StoreActionType } from '../redux/StoreActionType'
import { NavigationPropType, RoutesType } from '../constants/NavigationTypes'
import { DISCLAIMER_ROUTE } from 'api-client/src/routes'

const navigateToDisclaimer = <T extends RoutesType>({
  navigation,
  cityCode,
  languageCode
}: {
  dispatch: Dispatch<StoreActionType>
  navigation: NavigationPropType<T>
  cityCode: string
  languageCode: string
}): void => {
  navigation.navigate({
    name: DISCLAIMER_ROUTE,
    params: {
      cityCode,
      languageCode
    }
  })
}

export default navigateToDisclaimer
