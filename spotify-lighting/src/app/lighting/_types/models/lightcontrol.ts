import { LightResponse } from '../responses/external/hue/light'

export type LightControl = {
  light: LightResponse
  setHex: string
}