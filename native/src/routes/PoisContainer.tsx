import { LanguageResourceCacheStateType, StateType } from '../redux/StateType'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Dispatch } from 'redux'
import { StoreActionType, SwitchContentLanguageActionType } from '../redux/StoreActionType'
import withPayloadProvider, { StatusPropsType } from '../hocs/withPayloadProvider'
import withTheme from '../hocs/withTheme'
import * as React from 'react'
import Pois, { PropsType as PoisPropsType } from './Pois'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import navigateToLink from '../navigation/navigateToLink'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import { ErrorCode, POIS_ROUTE, PoisRouteType, PoiModel } from 'api-client'
import createNavigate from '../navigation/createNavigate'

type NavigationPropsType = {
  route: RoutePropType<PoisRouteType>
  navigation: NavigationPropType<PoisRouteType>
}
type OwnPropsType = NavigationPropsType
type ContainerPropsType = OwnPropsType & {
  path: string | null | undefined
  pois: Array<PoiModel>
  cityCode: string
  language: string
  resourceCache: LanguageResourceCacheStateType
  resourceCacheUrl: string
  dispatch: Dispatch<StoreActionType>
}
type RefreshPropsType = NavigationPropsType & {
  cityCode: string
  language: string
  path: string | null | undefined
}
type StatePropsType = StatusPropsType<ContainerPropsType, RefreshPropsType>
type DispatchPropsType = {
  dispatch: Dispatch<StoreActionType>
}

const onRouteClose = (routeKey: string, dispatch: Dispatch<StoreActionType>) => {
  dispatch({
    type: 'CLEAR_ROUTE',
    params: {
      key: routeKey
    }
  })
}

const createChangeUnavailableLanguage = (city: string) => (
  dispatch: Dispatch<StoreActionType>,
  newLanguage: string
) => {
  const switchContentLanguage: SwitchContentLanguageActionType = {
    type: 'SWITCH_CONTENT_LANGUAGE',
    params: {
      newLanguage,
      city
    }
  }
  dispatch(switchContentLanguage)
}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const {
    navigation,
    route: { key }
  } = ownProps

  if (!state.cityContent) {
    return {
      status: 'routeNotInitialized'
    }
  }

  const { resourceCache, routeMapping, switchingLanguage, languages } = state.cityContent
  const route = routeMapping[key]

  if (!route || route.routeType !== POIS_ROUTE) {
    return {
      status: 'routeNotInitialized'
    }
  }

  if (route.status === 'languageNotAvailable') {
    if (switchingLanguage) {
      throw new Error('language not available route status not handled!')
    }
    if (languages.status === 'error' || languages.status === 'loading') {
      console.error('languageNotAvailable status impossible if languages not ready')
      return {
        status: 'error',
        refreshProps: null,
        code: languages.status === 'error' ? languages.code : ErrorCode.UnknownError,
        message: languages.status === 'error' ? languages.message : 'languages not ready'
      }
    }

    return {
      status: 'languageNotAvailable',
      availableLanguages: languages.models.filter(lng => route.allAvailableLanguages.has(lng.code)),
      cityCode: route.city,
      changeUnavailableLanguage: createChangeUnavailableLanguage(route.city)
    }
  }

  const refreshProps = {
    path: route.path,
    cityCode: route.city,
    language: route.language,
    navigation: ownProps.navigation,
    route: ownProps.route
  }

  if (resourceCache.status === 'error') {
    return {
      status: 'error',
      message: resourceCache.message,
      code: resourceCache.code,
      refreshProps
    }
  } else if (route.status === 'error') {
    return {
      status: 'error',
      message: route.message,
      code: route.code,
      refreshProps
    }
  } else if (languages.status === 'error') {
    return {
      status: 'error',
      message: languages.message,
      code: languages.code,
      refreshProps
    }
  }

  const resourceCacheUrl = state.resourceCacheUrl

  if (resourceCacheUrl === null || switchingLanguage || route.status === 'loading' || languages.status === 'loading') {
    return {
      status: 'loading',
      progress: 0
    }
  }

  return {
    status: 'success',
    refreshProps,
    innerProps: {
      path: route.path,
      pois: Array.from(route.models),
      cityCode: route.city,
      language: route.language,
      resourceCache: resourceCache.value,
      resourceCacheUrl,
      navigation,
      route: ownProps.route
    }
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({
  dispatch
})

const ThemedTranslatedPois = withTranslation('pois')(withTheme<PoisPropsType>(Pois))

class PoisContainer extends React.Component<ContainerPropsType> {
  navigateToLinkProp = (url: string, language: string, shareUrl: string) => {
    const { dispatch, navigation } = this.props
    const navigateTo = createNavigate(dispatch, navigation)
    navigateToLink(url, navigation, language, navigateTo, shareUrl)
  }

  render() {
    const { dispatch, navigation, route, ...rest } = this.props
    return (
      <ThemedTranslatedPois
        {...rest}
        navigateTo={createNavigate(dispatch, navigation)}
        navigateToFeedback={createNavigateToFeedbackModal(navigation)}
        navigateToLink={this.navigateToLinkProp}
      />
    )
  }
}

const refresh = (refreshProps: RefreshPropsType, dispatch: Dispatch<StoreActionType>) => {
  const { navigation, route, cityCode, language, path } = refreshProps
  const navigateTo = createNavigate(dispatch, navigation)
  navigateTo(
    {
      route: POIS_ROUTE,
      cityCode,
      languageCode: language,
      cityContentPath: path || undefined
    },
    route.key,
    true
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
  // @ts-ignore
)(withPayloadProvider<ContainerPropsType, RefreshPropsType, PoisRouteType>(refresh, onRouteClose)(PoisContainer))
