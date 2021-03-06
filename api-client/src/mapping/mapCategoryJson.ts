import { JsonCategoryType } from '../types'
import CategoryModel from '../models/CategoryModel'
import moment from 'moment-timezone'
import mapAvailableLanguages from '../mapAvailableLanguages'
import normalizePath from '../normalizePath'

const mapCategoryJson = (json: JsonCategoryType, basePath: string): CategoryModel =>
  new CategoryModel({
    root: false,
    path: normalizePath(json.path),
    title: json.title,
    content: json.content,
    thumbnail: json.thumbnail,
    order: json.order,
    availableLanguages: mapAvailableLanguages(json.available_languages),
    parentPath: normalizePath(json.parent.path || basePath),
    lastUpdate: moment.tz(json.modified_gmt, 'GMT'),
    hash: json.hash
  })

export default mapCategoryJson
