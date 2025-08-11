import {
  hexToRgbString,
  hexToRgbaString,
  getContrastColor,
  lightenColor,
  darkenColor,
  isValidHex,
  normalizeHex,
} from './colors.utils'

export interface ColorScheme {
  primary: string
  primaryRgb: string
  primaryRgba: string
  secondary: string
  secondaryRgb: string
  secondaryRgba: string
  contrast: string
  lighter: string
  darker: string
  hover: string
  focus: string
  background: string
  text: string
  border: string
  shadow: string
}

/**
 * Gera um esquema de cores completo baseado na cor primária
 */
export const generateColorScheme = (
  primaryColor: string,
  secondaryColor?: string
): ColorScheme => {
  // Normaliza e valida as cores
  const normalizedPrimary = normalizeHex(primaryColor)
  const normalizedSecondary = secondaryColor
    ? normalizeHex(secondaryColor)
    : lightenColor(normalizedPrimary, 30)

  if (!isValidHex(normalizedPrimary)) {
    throw new Error(`Cor primária inválida: ${primaryColor}`)
  }

  if (!isValidHex(normalizedSecondary)) {
    throw new Error(`Cor secundária inválida: ${secondaryColor}`)
  }

  return {
    // Primary colors
    primary: normalizedPrimary,
    primaryRgb: hexToRgbString(normalizedPrimary),
    primaryRgba: hexToRgbaString(normalizedPrimary, 0.8),

    // Secondary colors
    secondary: normalizedSecondary,
    secondaryRgb: hexToRgbString(normalizedSecondary),
    secondaryRgba: hexToRgbaString(normalizedSecondary, 0.8),

    // Contrast colors
    contrast: getContrastColor(normalizedPrimary),

    // Primary color variations
    lighter: lightenColor(normalizedPrimary, 20),
    darker: darkenColor(normalizedPrimary, 20),
    hover: darkenColor(normalizedPrimary, 10),
    focus: lightenColor(normalizedPrimary, 10),

    // Cores de interface
    background: '#ffffff',
    text: '#1f2937', // gray-800
    border: lightenColor(normalizedPrimary, 60),
    shadow: hexToRgbaString(normalizedPrimary, 0.1),
  }
}

/**
 * Applies the color scheme to the custom CSS
 */
export const applyColorSchemeToCSS = (colorScheme: ColorScheme): string => {
  return `
    :root {
      --color-primary: ${colorScheme.primary};
      --color-primary-rgb: ${colorScheme.primaryRgb};
      --color-primary-rgba: ${colorScheme.primaryRgba};

      --color-secondary: ${colorScheme.secondary};
      --color-secondary-rgb: ${colorScheme.secondaryRgb};
      --color-secondary-rgba: ${colorScheme.secondaryRgba};

      --color-contrast: ${colorScheme.contrast};
      --color-lighter: ${colorScheme.lighter};
      --color-darker: ${colorScheme.darker};
      --color-hover: ${colorScheme.hover};
      --color-focus: ${colorScheme.focus};

      --color-background: ${colorScheme.background};
      --color-text: ${colorScheme.text};
      --color-border: ${colorScheme.border};
      --color-shadow: ${colorScheme.shadow};
    }

    .bg-primary { background-color: var(--color-primary) !important; }
    .bg-secondary { background-color: var(--color-secondary) !important; }
    .bg-lighter { background-color: var(--color-lighter) !important; }
    .bg-darker { background-color: var(--color-darker) !important; }

    .text-primary { color: var(--color-primary) !important; }
    .text-secondary { color: var(--color-secondary) !important; }
    .text-contrast { color: var(--color-contrast) !important; }

    .border-primary { border-color: var(--color-primary) !important; }
    .border-secondary { border-color: var(--color-secondary) !important; }
    .border-lighter { border-color: var(--color-lighter) !important; }

    .hover\\:bg-primary:hover { background-color: var(--color-hover) !important; }
    .hover\\:bg-secondary:hover { background-color: var(--color-secondary) !important; }
    .hover\\:text-primary:hover { color: var(--color-primary) !important; }
    .hover\\:border-primary:hover { border-color: var(--color-primary) !important; }

    .focus\\:ring-primary:focus { --tw-ring-color: var(--color-focus) !important; }
    .focus\\:border-primary:focus { border-color: var(--color-primary) !important; }

    .shadow-primary { box-shadow: 0 4px 6px -1px var(--color-shadow) !important; }
  `
}

/**
 * Generates Tailwind CSS custom classes
 */
export const generateTailwindClasses = (
  colorScheme: ColorScheme
): Record<string, string> => {
  return {
    'bg-primary': `bg-[${colorScheme.primary}]`,
    'bg-secondary': `bg-[${colorScheme.secondary}]`,
    'bg-lighter': `bg-[${colorScheme.lighter}]`,
    'bg-darker': `bg-[${colorScheme.darker}]`,

    'text-primary': `text-[${colorScheme.primary}]`,
    'text-secondary': `text-[${colorScheme.secondary}]`,
    'text-contrast': `text-[${colorScheme.contrast}]`,

    'border-primary': `border-[${colorScheme.primary}]`,
    'border-secondary': `border-[${colorScheme.secondary}]`,
    'border-lighter': `border-[${colorScheme.lighter}]`,

    'hover:bg-primary': `hover:bg-[${colorScheme.hover}]`,
    'hover:bg-secondary': `hover:bg-[${colorScheme.secondary}]`,
    'hover:text-primary': `hover:text-[${colorScheme.primary}]`,
    'hover:border-primary': `hover:border-[${colorScheme.primary}]`,

    'focus:ring-primary': `focus:ring-[${colorScheme.focus}]`,
    'focus:border-primary': `focus:border-[${colorScheme.primary}]`,

    'shadow-primary': `shadow-[0_4px_6px_-1px_${colorScheme.shadow}]`,
  }
}

/**
 * Applies the color scheme dynamically to the DOM
 */
export const applyColorSchemeToDOM = (colorScheme: ColorScheme): void => {
  // Remove previous styles if they exist
  const existingStyle = document.getElementById('dynamic-color-scheme')
  if (existingStyle) {
    existingStyle.remove()
  }

  // Create new style element
  const style = document.createElement('style')
  style.id = 'dynamic-color-scheme'
  style.textContent = applyColorSchemeToCSS(colorScheme)

  // Add to the head of the document
  document.head.appendChild(style)
}

/**
 * Hook to use the color scheme in React
 */
export const useColorScheme = (
  primaryColor: string,
  secondaryColor?: string
) => {
  const colorScheme = generateColorScheme(primaryColor, secondaryColor)

  const applyToDOM = () => {
    if (typeof window !== 'undefined') {
      applyColorSchemeToDOM(colorScheme)
    }
  }

  const getTailwindClasses = () => generateTailwindClasses(colorScheme)

  return {
    colorScheme,
    applyToDOM,
    getTailwindClasses,
  }
}

// Example usage:
/*
import { useColorScheme } from '@/utils/colorScheme.utils'

function MyComponent() {
  const { colorScheme, applyToDOM, getTailwindClasses } = useColorScheme('#ea580c', '#f97316')

  useEffect(() => {
    applyToDOM()
  }, [])

  const classes = getTailwindClasses()

  return (
    <div className={classes['bg-primary']}>
      <h1 className={classes['text-contrast']}>Title</h1>
      <button className={classes['bg-secondary'] + ' ' + classes['hover:bg-primary']}>
        Button
      </button>
    </div>
  )
}
*/
