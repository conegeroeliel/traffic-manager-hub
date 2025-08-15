export type Theme = 'light' | 'dark'

export interface ThemeColors {
  // Backgrounds
  background: string
  backgroundSecondary: string
  backgroundTertiary: string
  
  // Surfaces
  surface: string
  surfaceHover: string
  surfaceActive: string
  
  // Borders
  border: string
  borderSecondary: string
  
  // Text
  text: string
  textSecondary: string
  textTertiary: string
  
  // Accent colors
  primary: string
  primaryHover: string
  primaryActive: string
  
  // Status colors
  success: string
  warning: string
  error: string
  info: string
  
  // Shadows
  shadow: string
  shadowHover: string
}

export const lightTheme: ThemeColors = {
  // Backgrounds
  background: '#ffffff',
  backgroundSecondary: '#f8fafc',
  backgroundTertiary: '#f1f5f9',
  
  // Surfaces
  surface: '#ffffff',
  surfaceHover: '#f8fafc',
  surfaceActive: '#e2e8f0',
  
  // Borders
  border: '#e2e8f0',
  borderSecondary: '#f1f5f9',
  
  // Text
  text: '#0f172a',
  textSecondary: '#475569',
  textTertiary: '#94a3b8',
  
  // Accent colors
  primary: '#3b82f6',
  primaryHover: '#2563eb',
  primaryActive: '#1d4ed8',
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Shadows
  shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  shadowHover: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
}

export const darkTheme: ThemeColors = {
  // Backgrounds
  background: '#0f172a',
  backgroundSecondary: '#1e293b',
  backgroundTertiary: '#334155',
  
  // Surfaces
  surface: '#1e293b',
  surfaceHover: '#334155',
  surfaceActive: '#475569',
  
  // Borders
  border: '#334155',
  borderSecondary: '#475569',
  
  // Text
  text: '#f8fafc',
  textSecondary: '#cbd5e1',
  textTertiary: '#94a3b8',
  
  // Accent colors
  primary: '#60a5fa',
  primaryHover: '#3b82f6',
  primaryActive: '#2563eb',
  
  // Status colors
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  info: '#60a5fa',
  
  // Shadows
  shadow: '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
  shadowHover: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
}

export const getThemeColors = (theme: Theme): ThemeColors => {
  return theme === 'dark' ? darkTheme : lightTheme
}
