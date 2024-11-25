// @ts-ignore
import * as ColorConverter from 'cie-rgb-color-converter'
import { rgbToHex } from '../_lib/utils/colorConversion'
import { Card, CardBody, CardTitle, Form } from 'react-bootstrap'
import { ChangeEvent } from 'react'
import { LightControl } from '../_types/models/lightcontrol'

type Props = {
  lightControl: LightControl
  onSwitchChange: (event: ChangeEvent) => void
  onColorChange: (event: ChangeEvent) => void
}

export const LightCard = (props: Props) => {
  const {
    lightControl,
    onSwitchChange,
    onColorChange
  } = props

  const { light, setHex } = lightControl

  let hexValue = ''
    if (setHex) {
      hexValue = setHex
    } else {
      const rgb = ColorConverter.xyBriToRgb(light.color.xy.x, light.color.xy.y, 100.0)
      hexValue = rgbToHex(rgb.r, rgb.g, rgb.b)
    }

    return (
      <Card style={{ width: '18rem' }} key={`light-${light.id}`}>
        <CardBody>
          <CardTitle>{light.metadata.name}</CardTitle>
          <Form>
            <Form.Check
              type='switch'
              id={`switch/${light.id}`}
              label='Off/On'
              checked={light.on.on}
              onChange={onSwitchChange}
            />
          </Form>
          <input
            id={`colorpicker/${light.id}`}
            type='color'
            value={hexValue}
            onChange={onColorChange}
          />
        </CardBody>
      </Card>
    )
}