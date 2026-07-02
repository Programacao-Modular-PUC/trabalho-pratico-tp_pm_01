import { useTheme } from '../context/ThemeContext'
import { getPublicThemeClasses } from '../utils/publicTheme'

export function usePublicTheme() {
    const { theme } = useTheme()
    return getPublicThemeClasses(theme)
}
