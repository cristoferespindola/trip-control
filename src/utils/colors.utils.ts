export const hexToRgb = (
  hex: string
): { r: number; g: number; b: number } | null => {
  const cleanHex = hex.replace('#', '')

  if (!/^[0-9A-F]{3}$|^[0-9A-F]{6}$/i.test(cleanHex)) {
    return null
  }

  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map(char => char + char)
          .join('')
      : cleanHex

  const r = parseInt(fullHex.slice(0, 2), 16)
  const g = parseInt(fullHex.slice(2, 4), 16)
  const b = parseInt(fullHex.slice(4, 6), 16)

  return { r, g, b }
}

export const hexToRgbString = (hex: string): string => {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

export const hexToRgbaString = (hex: string, alpha: number = 1): string => {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}

export const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export const rgbStringToHex = (rgbString: string): string => {
  const match = rgbString.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/
  )
  if (!match) return rgbString

  const [, r, g, b] = match
  return rgbToHex(parseInt(r), parseInt(g), parseInt(b))
}

export const isLightColor = (hex: string): boolean => {
  const rgb = hexToRgb(hex)
  if (!rgb) return true

  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.5
}

export const getContrastColor = (hex: string): string => {
  return isLightColor(hex) ? '#000000' : '#ffffff'
}

export const lightenColor = (hex: string, percent: number = 10): string => {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const factor = 1 + percent / 100
  const r = Math.min(255, Math.round(rgb.r * factor))
  const g = Math.min(255, Math.round(rgb.g * factor))
  const b = Math.min(255, Math.round(rgb.b * factor))

  return rgbToHex(r, g, b)
}

export const darkenColor = (hex: string, percent: number = 10): string => {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const factor = 1 - percent / 100
  const r = Math.max(0, Math.round(rgb.r * factor))
  const g = Math.max(0, Math.round(rgb.g * factor))
  const b = Math.max(0, Math.round(rgb.b * factor))

  return rgbToHex(r, g, b)
}

export const isValidHex = (hex: string): boolean => {
  const cleanHex = hex.replace('#', '')
  return /^[0-9A-F]{3}$|^[0-9A-F]{6}$/i.test(cleanHex)
}

export const normalizeHex = (hex: string): string => {
  const cleanHex = hex.replace('#', '')

  if (cleanHex.length === 3) {
    const expanded = cleanHex
      .split('')
      .map(char => char + char)
      .join('')
    return `#${expanded}`
  }

  if (cleanHex.length === 6) {
    return `#${cleanHex}`
  }

  return hex
}

export const parseColorToHex = (color: string) => {
  if (color.startsWith('#')) {
    return normalizeHex(color)
  }

  if (color.startsWith('rgb')) {
    return rgbStringToHex(color)
  }

  return color
}

export const parseColorHexToRgba = (color: string, alpha: number = 1) => {
  if (color.startsWith('rgba')) {
    return color
  }

  if (color.startsWith('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`)
  }

  if (color.startsWith('#')) {
    return hexToRgbaString(color, alpha)
  }

  return color
}
