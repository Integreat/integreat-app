import * as React from 'react'
import { ReactElement } from 'react'
import styled from 'styled-components/native'
import { ActivityIndicator, ScrollView, Text, TextInput } from 'react-native'
import { ThemeType } from 'build-configs/ThemeType'
import { TFunction } from 'react-i18next'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Button } from 'react-native-elements'
import Caption from './Caption'
import { SendingStatusType } from './FeedbackContainer'
import buildConfig from '../constants/buildConfig'
import HappyIcon from '../assets/smile-happy.svg'

const Input = styled(TextInput)`
  padding: 15px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.themeColor};
  text-align-vertical: top;
`
const MailInput = styled(Input)`
  height: 50px;
`
const Wrapper = styled.View`
  padding: 40px;
  background-color: ${props => props.theme.colors.backgroundColor};
`
const DescriptionContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 15px 0 5px;
`
const ThemedText = styled.Text`
  display: flex;
  text-align: left;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
`
const Description = styled(ThemedText)`
  font-weight: bold;
`
const HappyIconContainer = styled.Image`
  margin: 100px auto 10px;
`

export type PropsType = {
  comment: string
  contactMail: string
  sendingStatus: SendingStatusType
  onCommentChanged: (comment: string) => void
  onFeedbackContactMailChanged: (contactMail: string) => void
  isSearchFeedback: boolean
  isPositiveFeedback: boolean
  onSubmit: () => void
  theme: ThemeType
  t: TFunction<'feedback'>
}

const Feedback = (props: PropsType): ReactElement => {
  const renderBox = (): React.ReactNode => {
    const { theme, t, isSearchFeedback, isPositiveFeedback, comment, contactMail, sendingStatus } = props
    const feedbackModalDescription = isPositiveFeedback ? 'positiveComment' : 'negativeComment'
    const description = isSearchFeedback ? 'wantedInformation' : feedbackModalDescription

    if (['idle', 'failed'].includes(sendingStatus)) {
      return (
        <>
          {!isSearchFeedback && <Caption theme={theme} title={t('feedback')} />}
          <DescriptionContainer theme={theme}>
            <Description theme={theme}>{t(description)}</Description>
            {isPositiveFeedback && <Text>({t('optionalInfo')})</Text>}
          </DescriptionContainer>
          <Input
            theme={theme}
            onChangeText={props.onCommentChanged}
            value={comment}
            multiline
            numberOfLines={3}
            autoFocus={!isSearchFeedback}
          />
          <DescriptionContainer theme={theme}>
            <Description theme={theme}>{t('contactMailAddress')}</Description>
            <Text>({t('optionalInfo')})</Text>
          </DescriptionContainer>
          <MailInput
            theme={theme}
            keyboardType='email-address'
            onChangeText={props.onFeedbackContactMailChanged}
            value={contactMail}
          />
          {sendingStatus === 'failed' && <Description theme={theme}>{t('failedSendingFeedback')}</Description>}
          <Button
            icon={<Icon name='send' size={15} color='black' />}
            titleStyle={{
              color: theme.colors.textColor
            }}
            buttonStyle={{
              backgroundColor: theme.colors.themeColor,
              marginTop: 15
            }}
            disabled={!isPositiveFeedback && !comment}
            onPress={props.onSubmit}
            title={t('send')}
          />
        </>
      )
    } else if (sendingStatus === 'sending') {
      return <ActivityIndicator size='large' color='#0000ff' />
    } else {
      // sendingStatus === 'successful') {
      return (
        <>
          <HappyIconContainer source={HappyIcon} />
          <Caption theme={theme} title={t('feedback:feedbackSent')} />
          <ThemedText theme={theme}>
            {t('feedback:thanksMessage', {
              appName: buildConfig().appName
            })}
          </ThemedText>
        </>
      )
    }
  }

  const { theme } = props
  return (
    <ScrollView
      keyboardShouldPersistTaps='handled'
      style={{
        backgroundColor: theme.colors.backgroundColor
      }}>
      <Wrapper theme={theme}>{renderBox()}</Wrapper>
    </ScrollView>
  )
}

export default Feedback
