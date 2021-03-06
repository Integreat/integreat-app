import * as React from 'react'
import { ReactNode } from 'react'
import styled from 'styled-components/native'
import { ThemeType } from 'build-configs'

type WrapperPropsType = {
  theme: ThemeType
}

const Wrapper = styled.View`
  flex: 1;
  background-color: ${(props: WrapperPropsType) => props.theme.colors.backgroundColor};
`

type AppPropsType = {
  children?: React.ReactNode
  theme: ThemeType
}

class Layout extends React.Component<AppPropsType> {
  render(): ReactNode {
    return <Wrapper theme={this.props.theme}>{this.props.children}</Wrapper>
  }
}

export default Layout
