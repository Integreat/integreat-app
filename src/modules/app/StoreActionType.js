// @flow

import { offlineActionTypes } from 'react-native-offline'

export type FetchCitiesRequestActionType = { type: 'FETCH_CITIES_REQUEST', params: { language: string } }
export type CitiesFetchSucceededActionType = { type: 'CITIES_FETCH_SUCCEEDED', payload: any }
export type CitiesFetchFailedActionType = { type: 'CITIES_FETCH_FAILED', message: string }
export type CitiesFetchActionType =
  FetchCitiesRequestActionType
  | CitiesFetchSucceededActionType
  | CitiesFetchFailedActionType

export type FetchCategoriesRequestActionType = { type: 'FETCH_CATEGORIES_REQUEST', params: { prioritisedLanguage: string, city: string } }
export type CategoriesFetchSucceededActionType = { type: 'CATEGORIES_FETCH_SUCCEEDED', payload: any, city: string, language: string }
export type CategoriesFetchFailedActionType = { type: 'CATEGORIES_FETCH_FAILED', message: string }
export type CategoriesFetchActionType =
  FetchCategoriesRequestActionType
  | CategoriesFetchSucceededActionType
  | CategoriesFetchFailedActionType

export type ConnectionChangeActionType = { type: offlineActionTypes.CONNECTION_CHANGE, payload: boolean }

export type DownloadResourcesRequestActionType = { type: 'DOWNLOAD_RESOURCES_REQUEST', params: { urls: Array<string> } }
export type ResourcesDownloadSucceededActionType = { type: 'RESOURCES_DOWNLOAD_SUCCEEDED', city: string, language: string, hashes: Map<string, string>}
export type ResourcesDownloadFailedActionType = { type: 'RESOURCES_DOWNLOAD_FAILED', message: string }
export type ResourcesDownloadActionType =
  DownloadResourcesRequestActionType
  | ResourcesDownloadSucceededActionType
  | ResourcesDownloadFailedActionType

export type StoreActionType = ConnectionChangeActionType | CitiesFetchActionType | CategoriesFetchActionType | ResourcesDownloadActionType
