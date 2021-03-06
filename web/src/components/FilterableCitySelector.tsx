import React, { ReactNode } from 'react'
import Heading from './Heading'
import ScrollingSearchBox from './ScrollingSearchBox'
import CitySelector from './CitySelector'
import { CityModel } from 'api-client'
import styled from 'styled-components'
import { withTranslation, TFunction } from 'react-i18next'

const Container = styled.div`
  padding-top: 22px;
`

type PropsType = {
  cities: Array<CityModel>
  language: string
  t: TFunction
}

type StateType = {
  filterText: string
  stickyTop: number
}

export class FilterableCitySelector extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props)
    this.state = { filterText: '', stickyTop: 0 }
  }

  handleFilterTextChanged = (filterText: string): void => this.setState({ filterText })

  handleStickyTopChanged = (stickyTop: number): void => this.setState({ stickyTop })

  render(): ReactNode {
    const { cities, language, t } = this.props
    const { filterText, stickyTop } = this.state

    return (
      <Container>
        <Heading />
        <ScrollingSearchBox
          filterText={filterText}
          onFilterTextChange={this.handleFilterTextChanged}
          placeholderText={t('searchCity')}
          spaceSearch={false}
          onStickyTopChanged={this.handleStickyTopChanged}>
          <CitySelector stickyTop={stickyTop} cities={cities} filterText={filterText} language={language} />
        </ScrollingSearchBox>
      </Container>
    )
  }
}

export default withTranslation('landing')(FilterableCitySelector)
