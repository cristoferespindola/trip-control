import {
  hexToRgb,
  hexToRgbString,
  hexToRgbaString,
  rgbToHex,
  rgbStringToHex,
  isLightColor,
  getContrastColor,
  lightenColor,
  darkenColor,
  isValidHex,
  normalizeHex,
} from './colors.utils'

// Exemplos de uso das funções de conversão de cores

// 1. Converter hex para RGB
console.log('=== Conversões Hex para RGB ===')
console.log(hexToRgb('#ff0000')) // { r: 255, g: 0, b: 0 }
console.log(hexToRgb('#00ff00')) // { r: 0, g: 255, b: 0 }
console.log(hexToRgb('#0000ff')) // { r: 0, g: 0, b: 255 }
console.log(hexToRgb('#f0f')) // { r: 255, g: 0, b: 255 } (hex de 3 caracteres)

// 2. Converter hex para string RGB
console.log('\n=== Hex para String RGB ===')
console.log(hexToRgbString('#ff0000')) // "rgb(255, 0, 0)"
console.log(hexToRgbString('#00ff00')) // "rgb(0, 255, 0)"
console.log(hexToRgbString('#0000ff')) // "rgb(0, 0, 255)"

// 3. Converter hex para string RGBA
console.log('\n=== Hex para String RGBA ===')
console.log(hexToRgbaString('#ff0000')) // "rgba(255, 0, 0, 1)"
console.log(hexToRgbaString('#ff0000', 0.5)) // "rgba(255, 0, 0, 0.5)"
console.log(hexToRgbaString('#00ff00', 0.8)) // "rgba(0, 255, 0, 0.8)"

// 4. Converter RGB para hex
console.log('\n=== RGB para Hex ===')
console.log(rgbToHex(255, 0, 0)) // "#ff0000"
console.log(rgbToHex(0, 255, 0)) // "#00ff00"
console.log(rgbToHex(0, 0, 255)) // "#0000ff"

// 5. Converter string RGB para hex
console.log('\n=== String RGB para Hex ===')
console.log(rgbStringToHex('rgb(255, 0, 0)')) // "#ff0000"
console.log(rgbStringToHex('rgba(0, 255, 0, 0.5)')) // "#00ff00"

// 6. Verificar se cor é clara ou escura
console.log('\n=== Verificação de Luminância ===')
console.log(isLightColor('#ffffff')) // true (branco é claro)
console.log(isLightColor('#000000')) // false (preto é escuro)
console.log(isLightColor('#ff0000')) // false (vermelho é escuro)
console.log(isLightColor('#ffff00')) // true (amarelo é claro)

// 7. Obter cor contrastante
console.log('\n=== Cores Contrastantes ===')
console.log(getContrastColor('#ffffff')) // "#000000" (preto sobre branco)
console.log(getContrastColor('#000000')) // "#ffffff" (branco sobre preto)
console.log(getContrastColor('#ff0000')) // "#ffffff" (branco sobre vermelho)

// 8. Clarear e escurecer cores
console.log('\n=== Clarear e Escurecer Cores ===')
console.log(lightenColor('#ff0000', 20)) // Versão 20% mais clara do vermelho
console.log(darkenColor('#ff0000', 20)) // Versão 20% mais escura do vermelho
console.log(lightenColor('#00ff00', 50)) // Versão 50% mais clara do verde

// 9. Validar hex
console.log('\n=== Validação de Hex ===')
console.log(isValidHex('#ff0000')) // true
console.log(isValidHex('#f0f')) // true
console.log(isValidHex('#invalid')) // false
console.log(isValidHex('not-hex')) // false

// 10. Normalizar hex
console.log('\n=== Normalização de Hex ===')
console.log(normalizeHex('#f0f')) // "#ff00ff"
console.log(normalizeHex('ff0000')) // "#ff0000"
console.log(normalizeHex('#ff0000')) // "#ff0000"

// Exemplo prático: Aplicar cor dinamicamente
export const applyDynamicColor = (hexColor: string) => {
  if (!isValidHex(hexColor)) {
    console.error('Cor hex inválida:', hexColor)
    return null
  }

  const normalizedColor = normalizeHex(hexColor)
  const rgbString = hexToRgbString(normalizedColor)
  const contrastColor = getContrastColor(normalizedColor)
  const lighterColor = lightenColor(normalizedColor, 20)
  const darkerColor = darkenColor(normalizedColor, 20)

  return {
    original: normalizedColor,
    rgb: rgbString,
    rgba: hexToRgbaString(normalizedColor, 0.8),
    contrast: contrastColor,
    lighter: lighterColor,
    darker: darkerColor,
    isLight: isLightColor(normalizedColor),
  }
}

// Exemplo de uso
const colorScheme = applyDynamicColor('#ea580c') // Cor laranja
console.log('\n=== Esquema de Cores Dinâmico ===')
console.log(colorScheme)
/*
{
  original: "#ea580c",
  rgb: "rgb(234, 88, 12)",
  rgba: "rgba(234, 88, 12, 0.8)",
  contrast: "#ffffff",
  lighter: "#ff6b1f",
  darker: "#d14a0a",
  isLight: false
}
*/
