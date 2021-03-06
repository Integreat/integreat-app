import SettingsHeader from '../components/SettingsHeader'
import { withTranslation } from 'react-i18next'
import withTheme from '../hocs/withTheme'

export default withTheme(withTranslation('layout')(SettingsHeader))
