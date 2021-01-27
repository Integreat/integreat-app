// @flow

import * as React from 'react'
import { useContext } from 'react'
import { ScrollView, View } from 'react-native'
import { LocalNewsModel, TunewsModel } from 'api-client'
import DateFormatterContext from '../../../modules/i18n/context/DateFormatterContext'
import type { ThemeType } from 'build-configs/ThemeType'
import {
  contentDirection,
  contentAlignment
} from '../../../modules/i18n/contentDirection'
import headerImage from '../assets/tu-news-header-details-icon.svg'
import styled from 'styled-components/native'
import type { StyledComponent } from 'styled-components'
import FastImage from 'react-native-fast-image'

const Container: StyledComponent<{||}, {||}, *> = styled.View`
  align-items: center;
  margin-horizontal: 3%;
  flex: 1;
`

const HeaderImageWrapper: StyledComponent<{||}, {||}, *> = styled.View`
  width: 95%;
  align-self: center;
  align-items: flex-start;
  margin-top: 19px;
  border-radius: 5px;
  background-color: rgba(2, 121, 166, 0.4);
`

const HeaderImage: StyledComponent<{||}, {||}, *> = styled(FastImage)`
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`

const Row: StyledComponent<{| language: string |}, ThemeType, *> = styled.View`
  flex-direction: ${props => contentDirection(props.language)};
  border-radius: 5px;
  width: 95%;
  flex-wrap: wrap;
  align-self: center;
  padding: 5px;
  background-color: ${props => props.theme.colors.tunewsThemeColor};
`
const NewsHeadLine: StyledComponent<{||}, ThemeType, *> = styled.Text`
  font-weight: 700;
  font-family: ${props => props.theme.fonts.decorativeFontBold};
  color: ${props => props.theme.colors.textColor};
  font-size: 18px;
  margin-top: 18px;
  margin-bottom: 15px;
`

const NewsContent: StyledComponent<{| language: string |},
  ThemeType,
  *> = styled.Text`
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
  font-size: 16px;
  letter-spacing: 0.5px;
  line-height: 24px;
  text-align: ${props => contentAlignment(props.language)};
  color: ${props => props.theme.colors.textColor};
`
const TunewsFooter: StyledComponent<{| underlined?: boolean, rightMargin: number |},
  ThemeType,
  *> = styled.Text`
  font-family: ${props => props.theme.fonts.decorativeFontBold};
  font-size: 12px;
  color: white;
  margin-right: ${props => props.rightMargin || 0}px;
  text-decoration-line: ${props => (props.underlined ? 'underline' : 'none')};
`

export type PropsType = {|
  theme: ThemeType,
  language: string,
  selectedNewsItem: TunewsModel | LocalNewsModel,
  isTunews: boolean,
  openTunewsLink: () => Promise<void>
|}

const NewsItemsDetails = ({
  theme,
  selectedNewsItem,
  isTunews,
  language,
  openTunewsLink
}: PropsType) => {
  const formatter = useContext(DateFormatterContext)

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          marginBottom: 10,
          paddingHorizontal: '5%'
        }}>
        {isTunews && (
          <HeaderImageWrapper>
            <HeaderImage source={headerImage} />
          </HeaderImageWrapper>
        )}
        <Container>
          <NewsHeadLine theme={theme}>{selectedNewsItem.title}</NewsHeadLine>
          <NewsContent theme={theme} language={language}>
            {[
              ...(selectedNewsItem.content ? [selectedNewsItem.content] : []),
              ...(selectedNewsItem.message ? [selectedNewsItem.message] : [])
            ]}
          </NewsContent>
        </Container>
        {isTunews && (
          <Row theme={theme} language={language}>
            <TunewsFooter theme={theme} rightMargin={3}>
              {selectedNewsItem.eNewsNo ? selectedNewsItem.eNewsNo : null}
            </TunewsFooter>
            <TunewsFooter
              rightMargin={3}
              onPress={openTunewsLink}
              theme={theme}
              underlined>
              tünews INTERNATIONAL
            </TunewsFooter>
            {
              (isTunews && (selectedNewsItem instanceof TunewsModel)) && (
                <TunewsFooter theme={theme} rightMargin={3}>
                  {formatter.format(selectedNewsItem.date, {
                    format: 'LL'
                  })}
                </TunewsFooter>
              )
            }
          </Row>
        )}
      </ScrollView>
    </View>
  )
}

export default NewsItemsDetails
