'use client'

import { Col, Container, Row, Card, CardBody, CardTitle, Form } from 'react-bootstrap' 
import { useLightPut } from '../_lib/hooks/useLightPut'
import { ChangeEvent, useEffect, useState } from 'react'
import { useLights } from '../_lib/hooks/useLights'
import { LightResponse } from '@/app/types/responses/external/hue/light'
// @ts-ignore
import * as ColorConverter from 'cie-rgb-color-converter'

const rgbToHex = (r: number, g: number, b: number) => {
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

const hexToRgb = (hex: string) => {
  let rHex = hex.slice(1, 3)
  let gHex = hex.slice(3, 5)
  let bHex = hex.slice(5, 7)

  const r = parseInt(rHex, 16)
  const g = parseInt(gHex, 16)
  const b = parseInt(bHex, 16)

  return { r, g, b }
}

type LightControl = {
  light: LightResponse
  selectedHex: string
}

export default function ControlCenter() {
  const { data } = useLights()
  const { mutate } = useLightPut()
  const [lights, setLights] = useState<LightControl[]>([])

  useEffect(() => {
    if (data) {
      setLights(data.filter(d => d.id === '050e462c-18dd-463b-a4ca-ceebbc85df24').map(r => ({ light: r, selectedHex: '' } as LightControl)))
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

    console.log('X Rounded', xRounded)
    console.log('Y Rounded', yRounded)

    let lightControl = lights?.find(l => l.light.id === hueId) || {} as LightControl
    lightControl.selectedHex = nexHex
    lightControl.light.color.xy.x = xRounded
    lightControl.light.color.xy.y = yRounded

    mutate({ hueId, on: lightControl.light.on.on, color: { x: xRounded, y: yRounded } })
  }

  const LightCard = ({
    name,
    hueId,
    on,
    color,
    setHex
    }: {
      name: string,
      hueId: string,
      on: boolean
      color: { x: number, y: number }
      setHex?: string
    }) => {

    let hexValue = ''
    if (setHex) {
      hexValue = setHex
    } else {
      const rgb = ColorConverter.xyBriToRgb(color.x, color.y, 100.0)
      hexValue = rgbToHex(rgb.r, rgb.g, rgb.b)
    }

    return (
      <Card style={{ width: '18rem' }} key={`light-${hueId}`}>
        <CardBody>
          <CardTitle>{name}</CardTitle>
          <Form>
            <Form.Check
              type='switch'
              id={`switch/${hueId}`}
              label='Off/On'
              checked={on}
              onChange={handleSwitchChange}
            />
          </Form>
          <input
            id={`colorpicker/${hueId}`}
            type='color'
            value={hexValue}
            onChange={handleColorChange}
          />
        </CardBody>
      </Card>
    )
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
  
        console.log('Rendering lights', leftLight.light.color.xy.x, leftLight.light.color.xy.y)

        const rowElement =
          <Row key={`row-${row}`}>
            <Col>
              <LightCard
                hueId={leftLight.light.id}
                name={leftLight.light.metadata.name}
                on={leftLight.light.on.on}
                color={{ x: leftLight.light.color.xy.x, y: leftLight.light.color.xy.y }}
                setHex={leftLight.selectedHex}
              />
            </Col>
            <Col>
              <LightCard
                hueId={rightLight.light.id}
                name={rightLight.light.metadata.name}
                on={rightLight.light.on.on}
                color={{ x: rightLight.light.color.xy.x, y: rightLight.light.color.xy.y }}
                setHex={rightLight.selectedHex}
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
                hueId={lastLight.light.id}
                name={lastLight.light.metadata.name}
                on={lastLight.light.on.on}
                color={{ x: lastLight.light.color.xy.x, y: lastLight.light.color.xy.y }}
                setHex={lastLight.selectedHex}
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