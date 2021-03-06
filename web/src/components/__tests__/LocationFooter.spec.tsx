import { shallow } from 'enzyme'
import React from 'react'
import { LocationFooter } from '../LocationFooter'

describe('LocationFooter', () => {
  const t = (key: string) => key

  it('should match snapshot', () => {
    expect(shallow(<LocationFooter city='augsburg' language='de' t={t} />)).toMatchSnapshot()
  })
})
