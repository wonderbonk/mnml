import { create } from 'zustand'
import type { ThemePreset } from '@/types'

interface ThemeStore {
  currentTheme: ThemePreset
  setTheme: (theme: ThemePreset) => void
}

export const useThemeStore = create<ThemeStore>((set) => {
  // Load theme from localStorage
  const savedTheme = localStorage.getItem('nexus_theme') as ThemePreset | null
  const initialTheme = savedTheme || 'matrix'

  // Apply theme to document
  document.documentElement.setAttribute('data-theme', initialTheme)

  return {
    currentTheme: initialTheme,

    setTheme: (theme) => {
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('nexus_theme', theme)
      set({ currentTheme: theme })
    },
  }
})
