'use client'

import { useEffect } from 'react'
import { useCompanySettings } from '@/contexts/CompanySettingsContext'
import {
  applyColorSchemeToDOM,
  generateColorScheme,
} from '@/utils/colorScheme.utils'

/**
 * Component that applies the company's colors dynamically to the system
 */
export default function DynamicColorProvider() {
  const { settings } = useCompanySettings()

  useEffect(() => {
    if (settings?.primaryColor) {
      try {
        const colorScheme = generateColorScheme(
          settings.primaryColor,
          settings.secondaryColor
        )
        applyColorSchemeToDOM(colorScheme)
      } catch (error) {
        console.error('Erro ao aplicar esquema de cores:', error)
      }
    }
  }, [settings?.primaryColor, settings?.secondaryColor])

  return null
}

/**
 * Hook to use dynamic colors in components
 */
export const useDynamicColors = () => {
  const { settings } = useCompanySettings()

  const getColorScheme = () => {
    if (!settings?.primaryColor) {
      return null
    }

    try {
      return generateColorScheme(settings.primaryColor, settings.secondaryColor)
    } catch (error) {
      console.error('Erro ao gerar esquema de cores:', error)
      return null
    }
  }

  const getInlineStyle = (property: string, fallback?: string) => {
    const colorScheme = getColorScheme()
    if (!colorScheme) return fallback || ''

    const colorMap: Record<string, string> = {
      primary: colorScheme.primary,
      secondary: colorScheme.secondary,
      contrast: colorScheme.contrast,
      lighter: colorScheme.lighter,
      darker: colorScheme.darker,
      hover: colorScheme.hover,
      focus: colorScheme.focus,
      border: colorScheme.border,
      shadow: colorScheme.shadow,
    }

    return colorMap[property] || fallback || ''
  }

  return {
    colorScheme: getColorScheme(),
    getInlineStyle,
    primaryColor: settings?.primaryColor,
    secondaryColor: settings?.secondaryColor,
  }
}

/**
 * Example component using dynamic colors
 */
export const DynamicButton = ({
  children,
  variant = 'primary',
  ...props
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { getInlineStyle } = useDynamicColors()

  const getButtonStyle = () => {
    const baseStyle = {
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.2s',
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: getInlineStyle('primary', '#ea580c'),
          color: getInlineStyle('contrast', '#ffffff'),
        }
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: getInlineStyle('secondary', '#f97316'),
          color: getInlineStyle('contrast', '#ffffff'),
        }
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: getInlineStyle('primary', '#ea580c'),
          border: `1px solid ${getInlineStyle('primary', '#ea580c')}`,
        }
      default:
        return baseStyle
    }
  }

  return (
    <button
      style={getButtonStyle()}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = getInlineStyle(
          'hover',
          '#d14a0a'
        )
      }}
      onMouseLeave={e => {
        const style = getButtonStyle()
        e.currentTarget.style.backgroundColor =
          'backgroundColor' in style ? style.backgroundColor : ''
      }}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * Example component for cards with dynamic colors
 */
export const DynamicCard = ({
  children,
  ...props
}: {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) => {
  const { getInlineStyle } = useDynamicColors()

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: `1px solid ${getInlineStyle('border', '#e5e7eb')}`,
    borderRadius: '0.5rem',
    padding: '1.5rem',
    boxShadow: `0 4px 6px -1px ${getInlineStyle('shadow', 'rgba(0, 0, 0, 0.1)')}`,
  }

  return (
    <div style={cardStyle} {...props}>
      {children}
    </div>
  )
}

/**
 * Example component for badges with dynamic colors
 */
export const DynamicBadge = ({
  children,
  variant = 'primary',
  ...props
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
} & React.HTMLAttributes<HTMLSpanElement>) => {
  const { getInlineStyle } = useDynamicColors()

  const getBadgeStyle = () => {
    const baseStyle = {
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontSize: '0.75rem',
      fontWeight: '500',
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: getInlineStyle('lighter', '#fef3c7'),
          color: getInlineStyle('primary', '#ea580c'),
        }
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: getInlineStyle('secondary', '#f97316'),
          color: getInlineStyle('contrast', '#ffffff'),
        }
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: '#dcfce7',
          color: '#166534',
        }
      case 'warning':
        return {
          ...baseStyle,
          backgroundColor: '#fef3c7',
          color: '#92400e',
        }
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: '#fee2e2',
          color: '#991b1b',
        }
      default:
        return baseStyle
    }
  }

  return (
    <span style={getBadgeStyle()} {...props}>
      {children}
    </span>
  )
}
