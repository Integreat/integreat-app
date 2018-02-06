import React from 'react'
import PropTypes from 'prop-types'
import { Row } from 'react-flexbox-grid'

import ExtraModel from 'modules/endpoint/models/ExtraModel'
import Extra from './Extra'

class ExtraTiles extends React.Component {
  static propTypes = {
    extras: PropTypes.arrayOf(PropTypes.instanceOf(ExtraModel)).isRequired
  }

  render () {
    return (
      <div>
        <Row>
          {this.props.extras.map(extra =>
            <Extra key={extra.name}
                   extra={extra} />)}
        </Row>
      </div>
    )
  }
}

export default ExtraTiles
