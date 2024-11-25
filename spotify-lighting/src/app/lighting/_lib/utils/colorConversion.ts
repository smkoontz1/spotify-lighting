
export const rgbToHex = (r: number, g: number, b: number) => {
  let rHex = r.toString(16)
  let gHex = g.toString(16)
  let bHex = b.toString(16)

  if (rHex.length === 1) {
    rHex = '0' + rHex
  }

  if (gHex.length === 1) {
    gHex = '0' + gHex
  }

  if (bHex.length === 1) {
    bHex = '0' + bHex
  }

  return '#' + rHex + gHex + bHex
}

export const hexToRgb = (hex: string) => {
  let rHex = hex.slice(1, 3)
  let gHex = hex.slice(3, 5)
  let bHex = hex.slice(5, 7)

  const r = parseInt(rHex, 16)
  const g = parseInt(gHex, 16)
  const b = parseInt(bHex, 16)

  return { r, g, b }
}