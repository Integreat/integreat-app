import { applyMiddleware, combineReducers, createStore } from 'redux'
import { handleAction } from 'redux-actions'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { routerForBrowser } from 'redux-little-router'
import createBrowserHistory from 'history/createBrowserHistory'
import compose from 'lodash/fp/compose'

import routes from './routes'
import endpointReducers from 'endpoints/reducers'
import { setAvailableLanguages, setLanguageChangeUrls } from './actions'

/**
 * Holds the current history implementation
 */
export const history = createBrowserHistory()

history.listen((location, action) => {
  // Keep default behavior of restoring scroll position when user:
  // - clicked back button
  // - clicked on a link that programmatically calls `history.goBack()`
  // - manually changed the URL in the address bar (here we might want
  // to scroll to top, but we can't differentiate it from the others)
  if (action === 'POP') {
    return
  }
  // In all other cases, scroll to top
  window.scrollTo(0, 0)
})

// Additional reducers
const {
  enhancer,
  reducer,
  middleware
} = routerForBrowser({routes, basename: '', history})

/**
 * The middlewares of this app, add additional middlewares here
 * @type {[*]}
 */
let middlewares = [
  middleware,
  thunkMiddleware // Allows to return functions in actions
]

// eslint-disable-next-line no-undef
if (__DEV__) {
  middlewares.push(createLogger()) // Logs all state changes in console
}

/**
 * The reducer to store the urls for language change
 */
const setLanguageChangeUrlsReducer = handleAction(setLanguageChangeUrls,
  (state, action) => action.payload, {}
)

/**
 * The reducer to store the ids of the available languages
 */
const setAvailableLanguagesReducer = handleAction(setAvailableLanguages,
  (state, action) => action.payload, {}
)

/**
 * Configures the main store which holds the global state of the app
 *
 * @param preloadedState
 * @returns {*} A configured store
 */
const configureStore = function configureStore (preloadedState) {
  return createStore(
    combineReducers({
      ...endpointReducers,
      router: reducer,
      languageChangeUrls: setLanguageChangeUrlsReducer,
      availableLanguages: setAvailableLanguagesReducer
    }),
    preloadedState,
    compose(enhancer, applyMiddleware(...middlewares))
  )
}

/**
 * The main store of this app
 */
export default configureStore()
