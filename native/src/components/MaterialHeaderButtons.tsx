import * as React from 'react'
import { ReactElement } from 'react'
import {
  defaultOnOverflowMenuPress,
  HeaderButton,
  HeaderButtons,
  onOverflowMenuPressParams
} from 'react-navigation-header-buttons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { ThemeType } from 'build-configs'

const MaterialHeaderButton = (props: {
  title: string
  onPress: () => void
  getButtonElement: () => React.ReactElement<any>
}) => <HeaderButton {...props} IconComponent={MaterialIcon} iconSize={23} color='black' />

// Adjust cancel label for ios overflow menu of HeaderButtons
const onOverflowMenuPress = (cancelButtonLabel: string) => ({
  overflowButtonRef,
  hiddenButtons
}: onOverflowMenuPressParams) =>
  defaultOnOverflowMenuPress({
    overflowButtonRef,
    hiddenButtons,
    cancelButtonLabel
  })

const MaterialHeaderButtons = (props: {
  cancelLabel: string
  children: React.ReactNode
  theme: ThemeType
}): ReactElement => {
  const { cancelLabel, theme, ...otherProps } = props
  return (
    <HeaderButtons
      HeaderButtonComponent={MaterialHeaderButton}
      OverflowIcon={<MaterialIcon name='more-vert' size={23} color={theme.colors.textColor} />}
      onOverflowMenuPress={onOverflowMenuPress(cancelLabel)}
      {...otherProps}
    />
  )
}

export default MaterialHeaderButtons
