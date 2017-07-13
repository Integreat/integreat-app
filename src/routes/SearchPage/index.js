import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import normalizeUrl from 'normalize-url'

import Layout from 'components/Layout'
import LANGUAGE_ENDPOINT from 'endpoints/language'
import Payload from 'endpoints/Payload'
import ContentList from 'components/Content/ContentList'
import PAGE_ENDPOINT from 'endpoints/page'
import { forEach } from 'lodash/collection'
import Hierarchy from 'routes/LocationPage/Hierarchy'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

class SearchPage extends React.Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    pagePayload: PropTypes.instanceOf(Payload).isRequired
  }

  componentWillUnmount () {
    this.props.dispatch(LANGUAGE_ENDPOINT.invalidateAction())
  }

  componentWillMount () {
    let location = this.getLocation()
    let languageCode = this.props.language
    this.props.dispatch(LANGUAGE_ENDPOINT.fetchEndpointAction({
      location: location,
      language: languageCode
    }))
    this.props.dispatch(PAGE_ENDPOINT.fetchEndpointAction({
      location: location,
      language: languageCode,
      since: BIRTH_OF_UNIVERSE
    }, {location: location}))
  }

  getParentPath () {
    return '/location/' + this.getLocation()
  }

  getLocation () {
    return this.props.match.params.location
  }

  flattenPages () {
    let url = normalizeUrl(this.getParentPath(), {removeTrailingSlash: true})
    let page = this.props.pagePayload.data
    if (!page) {
      return {}
    }
    let pages = {}
    this._flattenPages(url, new Hierarchy(), page, pages)
    return pages
  }

  _flattenPages (url, hierarchy, root, result) {
    forEach(root.children, page => {
      let nextHierarchy = hierarchy.push(page)
      result[url + nextHierarchy.path()] = page
      this._flattenPages(url, nextHierarchy, page, result)
    })
  }

  render () {
    return (
      <Layout currentLanguage={this.props.language}>
        <ContentList pages={this.flattenPages()}/>
      </Layout>
    )
  }
}

/**
 * @param state The current app state
 * @return {{locations: {}}}  The endpoint values from the state mapped to props
 */
function mapStateToProps (state) {
  return ({
    language: state.language.language,
    pagePayload: state.pages
  })
}

export default connect(mapStateToProps)(SearchPage)
