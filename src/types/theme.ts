export type ThemePreset = 'matrix' | 'lumon' | 'starwars' | 'cyberpunk'

export interface Theme {
  name: string
  colors: {
    background: string
    backgroundSecondary: string
    backgroundTertiary: string
    foreground: string
    foregroundSecondary: string
    primary: string
    primaryGlow: string
    secondary: string
    secondaryGlow: string
    accent: string
    accentGlow: string
    success: string
    error: string
    warning: string
    info: string
    border: string
    shadow: string
  }
  effects: {
    glowIntensity: number
    scanlineOpacity: number
    chromaticAberration: number
    noiseIntensity: number
    crtCurvature: number
  }
  typography: {
    fontFamily: string
    fontSize: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
      '2xl': string
      '3xl': string
    }
    fontWeight: {
      normal: number
      medium: number
      semibold: number
      bold: number
    }
  }
  animation: {
    duration: {
      fast: string
      normal: string
      slow: string
    }
    easing: {
      smooth: string
      bounce: string
      sharp: string
    }
  }
}
