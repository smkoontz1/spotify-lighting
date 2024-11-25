import { Color } from '../../models/color'

export type UpdateLightRequest = {
  hueId: string
  on?: boolean
  color?: Color
}