
type Metadata = {
  name: string
}

type OnState = {
  on: boolean
}
type DimmingState = {
  brightness: number
  min_dim_level: number
}

type ColorTemperature = {
  mirek: number
  mirek_valid: boolean
  mirek_schema: {
    mirek_minimum: number
    mirek_maximum: number
  }
}

type ColorXY = {
  x: number
  y: number
}

type ColorGamut = {
  red: { x: number, y: number }
  green: { x: number, y: number }
  blue: { x: number, y: number }
}

type Color = {
  xy: ColorXY
  gamut: ColorGamut
  gamut_type: string
}

export type LightResponse = {
  id: string
  metadata: Metadata
  on: OnState
  dimming: DimmingState
  color_temperature: ColorTemperature
  color: Color
}