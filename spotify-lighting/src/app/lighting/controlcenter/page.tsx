'use client'

import { Col, Container, Row, Card, CardBody, CardTitle, Form } from 'react-bootstrap' 
import { useLightPut } from '../_lib/hooks/useLightPut'
import { ChangeEvent, useEffect, useState } from 'react'
import { useLights } from '../_lib/hooks/useLights'
import { LightResponse } from '@/app/types/responses/external/hue/light'

export default function ControlCenter() {
  const { data } = useLights()
  const { mutate } = useLightPut()
  const [lights, setLights] = useState<LightResponse[]>([])

  useEffect(() => {
    if (data) {
      setLights(data)
    }
  }, [data])

  const handleSwitchChange = (event: ChangeEvent) => {
    const id = event.target.id
    const hueId = id.split('/')[1]
    const checked = (event.target as any).checked as boolean

    let light = lights?.find(l => l.id === hueId) || {} as LightResponse
    light.on = { on: checked }

    mutate({ hueId, on: checked })
  }

  const LightCard = ({
    name,
    hueId,
    on
    }: {
      name: string,
      hueId: string,
      on: boolean
    }) => {
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
  
        const rowElement =
          <Row key={`row-${row}`}>
            <Col>
              <LightCard
                hueId={leftLight.id}
                name={leftLight.metadata.name}
                on={leftLight.on.on}
              />
            </Col>
            <Col>
              <LightCard
                hueId={rightLight.id}
                name={rightLight.metadata.name}
                on={rightLight.on.on}
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
                hueId={lastLight.id}
                name={lastLight.metadata.name}
                on={lastLight.on.on}
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