'use client'

import { Col, Container, Row, Card, CardBody, CardTitle, Form } from 'react-bootstrap' 
import { useLight } from '../_lib/hooks/useLight'
import { ChangeEvent, useEffect, useState } from 'react'
import { useLights } from '../_lib/hooks/useLights'


export default function ControlCenter() {
  const { data } = useLights()
  const { mutate } = useLight()

  const [lightMap, setLightMap] = useState<Map<string, boolean>>(new Map<string, boolean>())

  useEffect(() => {
    if (data) {
      data.forEach(l => {
        setLightMap(lightMap.set(l.hueId, false))
      })
    }
  }, [data])

  const handleSwitchChange = (event: ChangeEvent) => {
    const id = event.target.id
    const hueId = id.split('/')[1]
    const checked = (event.target as any).checked as boolean

    setLightMap(lightMap.set(hueId, checked))
    
    mutate({ id: hueId, on: checked })
  }

  const LightCard = ({ name, hueId }: { name: string, hueId: string }) => {
    return (
      <Card style={{ width: '18rem' }} key={`light-${hueId}`}>
        <CardBody>
          <CardTitle>{name}</CardTitle>
          <Form>
            <Form.Check
              type='switch'
              id={`switch/${hueId}`}
              label='Off/On'
              checked={lightMap.get(hueId) || false}
              onChange={handleSwitchChange}
            />
          </Form>
        </CardBody>
      </Card>
    )
  }

  const LightRows = () => {
    let rowElements: JSX.Element[] = []
    
    if (data) {
      const rowCount = data.length / 2
      const remainingLights = data.length % 2
  
      let leftColumnIndex = 0
  
  
      for (let row = 1; row <= rowCount; row++) {
        const leftLight = data[leftColumnIndex]
        const rightLight = data[leftColumnIndex + 1]
  
        const rowElement =
          <Row key={`row-${row}`}>
            <Col>
              <LightCard
                name={leftLight.name}
                hueId={leftLight.hueId}
              />
            </Col>
            <Col>
              <LightCard
                name={rightLight.name}
                hueId={rightLight.hueId}
              />
            </Col>
          </Row>
  
        rowElements = [...rowElements, rowElement]
        leftColumnIndex += 2
      }
  
      if (remainingLights > 0) {
        const lastLight = data[data.length - 1]
  
        const lastRowElement =
          <Row key={'last-row'}>
            <Col>
              <LightCard
                key={`light-${lastLight.hueId}`}
                name={lastLight.name}
                hueId={lastLight.hueId}
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