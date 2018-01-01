import React from 'react'
import { shallow } from 'enzyme'
import PdfButton from '../PdfButton'

const href = '/augsburg/de'

describe('PdfButton', () => {
  test('should render', () => {
    const wrapper = shallow(<PdfButton href={href} />)
    expect(wrapper).toMatchSnapshot()
  })
})
