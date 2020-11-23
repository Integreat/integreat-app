// @flow

import * as React from 'react'
import { View } from 'react-native'

import Page from '../../common/components/Page'
import Tiles from '../../common/components/Tiles'
import type { CategoryListModelType, ListContentModelType } from './CategoryList'
import CategoryList from './CategoryList'
import TileModel from '../../common/models/TileModel'
import {
  CategoryModel,
  CityModel
} from 'api-client'
import type { ThemeType } from '../../theme/constants'
import { URL_PREFIX } from '../../platform/constants/webview'
import CategoriesRouteStateView from '../../app/CategoriesRouteStateView'
import type { PageResourceCacheStateType, LanguageResourceCacheStateType } from '../../app/StateType'
import type { NavigateToCategoryParamsType } from '../../app/createNavigateToCategory'
import type { NavigateToInternalLinkParamsType } from '../../app/createNavigateToInternalLink'
import type { NavigationStackProp } from 'react-navigation-stack'
import { type TFunction } from 'react-i18next'
import SpaceBetween from '../../common/components/SpaceBetween'
import SiteHelpfulBox from '../../common/components/SiteHelpfulBox'
import type { FeedbackInformationType } from '../../../routes/feedback/containers/FeedbackModalContainer'

type PropsType = {|
  cities: Array<CityModel>,
  language: string,

  stateView: CategoriesRouteStateView,
  cityCode: string,
  navigateToCategory: NavigateToCategoryParamsType => void,
  navigateToInternalLink: NavigateToInternalLinkParamsType => void,

  navigation: NavigationStackProp<*>,
  resourceCache: LanguageResourceCacheStateType,
  resourceCacheUrl: string,
  theme: ThemeType,
  t: TFunction
|}

/**
 * Displays a CategoryTable, CategoryList or a single category as page matching the route /<cityCode>/<language>*
 */
class Categories extends React.Component<PropsType> {
  onTilePress = (tile: TileModel) => {
    const { cityCode, language, navigateToCategory } = this.props
    navigateToCategory({ cityCode, language, path: tile.path })
  }

  onItemPress = (category: { title: string, thumbnail: string, path: string }) => {
    const { cityCode, language, navigateToCategory } = this.props
    navigateToCategory({ cityCode, language, path: category.path })
  }

  navigateToFeedback = (isPositiveFeedback: boolean) => {
    const { navigation, stateView, cities, cityCode, language } = this.props
    if (!cityCode || !language) {
      throw Error('language or cityCode not available')
    }

    const cityTitle = CityModel.findCityName(cities, cityCode)
    const category = stateView.root()

    const feedbackInformation: FeedbackInformationType = {
      type: 'Category',
      language,
      cityTitle: cityTitle,
      title: !category.isRoot() ? category.title : undefined,
      path: !category.isRoot() ? category.path : undefined,
      isPositiveFeedback
    }

    navigation.navigate('FeedbackModal', { ...feedbackInformation })
  }

  getCachedThumbnail (category: CategoryModel): ?string {
    if (category.thumbnail) {
      const resource = this.getCategoryResourceCache(category)[category.thumbnail]

      if (resource) {
        return URL_PREFIX + resource.filePath
      }
    }
    return null
  }

  getTileModels (categories: Array<CategoryModel>): Array<TileModel> {
    return categories.map(category =>
      new TileModel({
        title: category.title,
        path: category.path,
        thumbnail: this.getCachedThumbnail(category) || category.thumbnail,
        isExternalUrl: false
      }))
  }

  getCategoryResourceCache (category: CategoryModel): PageResourceCacheStateType {
    return this.props.resourceCache[category.path] || {}
  }

  getListModel (category: CategoryModel): CategoryListModelType {
    return {
      title: category.title,
      path: category.path,
      thumbnail: this.getCachedThumbnail(category) || category.thumbnail
    }
  }

  getListModels (categories: Array<CategoryModel>): Array<CategoryListModelType> {
    return categories.map(category => this.getListModel(category))
  }

  getListContentModel (category: CategoryModel): ?ListContentModelType {
    const { navigation, navigateToInternalLink, resourceCacheUrl } = this.props
    return category.content ? {
      content: category.content,
      files: this.getCategoryResourceCache(category),
      navigation: navigation,
      navigateToInternalLink: navigateToInternalLink,
      resourceCacheUrl: resourceCacheUrl
    } : undefined
  }

  /**
   * Returns the content to be displayed, based on the current category, which is
   * a) page with information
   * b) table with categories
   * c) list with categories
   * @return {*} The content to be displayed
   */
  render () {
    const { stateView, navigateToInternalLink, theme, navigation, language, resourceCacheUrl, t } = this.props

    const category = stateView.root()
    const children = stateView.children()

    if (children.length === 0) {
      // last level, our category is a simple page
      const files = this.getCategoryResourceCache(category)
      return <Page title={category.title}
                   content={category.content}
                   lastUpdate={category.lastUpdate}
                   theme={theme}
                   files={files}
                   language={language}
                   navigation={navigation}
                   navigateToFeedback={this.navigateToFeedback}
                   navigateToInternalLink={navigateToInternalLink}
                   resourceCacheUrl={resourceCacheUrl} />
    } else if (category.isRoot()) {
      // first level, we want to display a table with all first order categories

      return <SpaceBetween>
        <View>
          <Tiles tiles={this.getTileModels(children)}
                 language={language}
                 onTilePress={this.onTilePress}
                 theme={theme} />
        </View>
        <SiteHelpfulBox navigateToFeedback={this.navigateToFeedback} theme={theme} t={t} />
      </SpaceBetween>
    }
    // some level between, we want to display a list
    return (
      <SpaceBetween>
      <View>
        <CategoryList
          categories={children.map((model: CategoryModel) => {
            const newStateView = stateView.stepInto(model.path)
            const children = newStateView.children()
            return ({
              model: this.getListModel(model),
              subCategories: this.getListModels(children)
            })
          })}
          thumbnail={this.getCachedThumbnail(category) || category.thumbnail}
          title={category.title}
          listContent={this.getListContentModel(category)}
          language={language}
          onItemPress={this.onItemPress}
          theme={theme} />
      </View>
      <SiteHelpfulBox navigateToFeedback={this.navigateToFeedback} theme={theme} t={t} />
      </SpaceBetween>
    )
  }
}

export default Categories
