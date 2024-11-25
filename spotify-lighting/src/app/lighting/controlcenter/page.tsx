'use client'

import { Col, Container, Row, Card, CardBody, CardTitle, Form } from 'react-bootstrap' 
import { useLightPut } from '../_lib/hooks/useLightPut'
import { ChangeEvent, useEffect, useState } from 'react'
import { useLights } from '../_lib/hooks/useLights'
import { LightResponse } from '@/app/lighting/_types/responses/external/hue/light'
// @ts-ignore
import * as ColorConverter from 'cie-rgb-color-converter'

import { hexToRgb } from '../_lib/utils/colorConversion'
import { LightCard } from '../_components/LightCard'

type LightControl = {
  light: LightResponse
  setHex: string
}

export default function ControlCenter() {
  const { data } = useLights()
  const { mutate } = useLightPut()
  const [lights, setLights] = useState<LightControl[]>([])

  useEffect(() => {
    if (data) {
      setLights(data.map(r => ({ light: r, setHex: '' } as LightControl)))
    }
  }, [data])

  const handleSwitchChange = (event: ChangeEvent) => {
    const elementId = event.target.id
    const hueId = elementId.split('/')[1]
    const checked = (event.target as any).checked as boolean

    let light = lights?.find(l => l.light.id === hueId)?.light || {} as LightResponse
    light.on = { on: checked }

    mutate({ hueId, on: checked, color: { x: light.color.xy.x, y: light.color.xy.y } })
  }

  const handleColorChange = (event: ChangeEvent) => {
    const elementId = event.target.id
    const hueId = elementId.split('/')[1]

    const nexHex = (event.target as any).value
    const newRgb = hexToRgb(nexHex)
    const newXY = ColorConverter.rgbToXy(newRgb.r, newRgb.g, newRgb.b)

    const xRounded = Math.round(newXY.x * 1000) / 1000
    const yRounded = Math.round(newXY.y * 1000) / 1000

    let lightControl = lights?.find(l => l.light.id === hueId) || {} as LightControl
    lightControl.setHex = nexHex
    lightControl.light.color.xy.x = xRounded
    lightControl.light.color.xy.y = yRounded

    mutate({ hueId, on: lightControl.light.on.on, color: { x: xRounded, y: yRounded } })
  }

  const LightRows = () => {
    let rowElements: JSX.Element[] = []
    
    if (lights) {
      const rowCount = lights.length / 2
      const remainingLights = lights.length % 2
  
      let leftColumnIndex = 0
  
      for (let row = 1; row <= rowCount; row++) {
        const leftLight = lights[leftColumnIndex]
        const rightLight = lights[leftColumnIndex + 1]
  
        const rowElement =
          <Row key={`row-${row}`}>
            <Col>
              <LightCard
                lightControl={leftLight}
                onSwitchChange={handleSwitchChange}
                onColorChange={handleColorChange}
              />
            </Col>
            <Col>
              <LightCard
                lightControl={rightLight}
                onSwitchChange={handleSwitchChange}
                onColorChange={handleColorChange}
              />
            </Col>
          </Row>
  
        rowElements = [...rowElements, rowElement]
        leftColumnIndex += 2
      }
  
      if (remainingLights > 0) {
        const lastLight = lights[lights.length - 1]
  
        const lastRowElement =
          <Row key={'last-row'}>
            <Col>
              <LightCard
                lightControl={lastLight}
                onSwitchChange={handleSwitchChange}
                onColorChange={handleColorChange}
              />
            </Col>
          </Row>
        
        rowElements = [...rowElements, lastRowElement]
      }
    }

    return rowElements
  }

  return(
    <>
      <Container>
        <LightRows />
      </Container>
    </>
  )
}