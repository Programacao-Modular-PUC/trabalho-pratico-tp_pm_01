import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'marauReservePublicTheme'

const ThemeContext = createContext(null)

function readStoredTheme() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored === 'light' ? 'light' : 'dark'
    } catch {
        return 'dark'
    }
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(readStoredTheme)

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, theme)
        document.documentElement.setAttribute('data-public-theme', theme)
    }, [theme])

    const value = useMemo(() => ({
        theme,
        isLight: theme === 'light',
        setTheme,
        toggleTheme: () => setTheme((current) => (current === 'light' ? 'dark' : 'light'))
    }), [theme])

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}
