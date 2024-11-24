import { Color } from '../../appmodel/color'

export type UpdateLightRequest = {
  hueId: string
  on: boolean
  color?: Color
}