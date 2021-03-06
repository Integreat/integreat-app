import * as React from 'react'
import { ReactNode } from 'react'
import styled from 'styled-components/native'
import { LanguageModel } from 'api-client'
import Selector from './Selector'
import SelectorItemModel from '../models/SelectorItemModel'
import { Text } from 'react-native'
import Caption from './Caption'
import { TFunction } from 'react-i18next'
import { ThemeType } from 'build-configs'

const Wrapper = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.backgroundColor};
  align-items: center;
`
export type PropsType = {
  theme: ThemeType
  languages: Array<LanguageModel>
  changeLanguage: (newLanguage: string) => void
  t: TFunction
}

class LanguageNotAvailablePage extends React.Component<PropsType> {
  onPress = (model: LanguageModel): void => {
    this.props.changeLanguage(model.code)
  }

  render(): ReactNode {
    const { t, languages, theme } = this.props
    return (
      <Wrapper theme={theme}>
        <Caption title={t('languageNotAvailable')} theme={theme} />
        <Text>{t('chooseALanguage')}</Text>
        <Selector
          verticalLayout
          items={languages.map(
            languageModel =>
              new SelectorItemModel({
                code: languageModel.code,
                name: languageModel.name,
                enabled: true,
                onPress: () => this.onPress(languageModel)
              })
          )}
          selectedItemCode={null}
          theme={theme}
        />
      </Wrapper>
    )
  }
}

export default LanguageNotAvailablePage
