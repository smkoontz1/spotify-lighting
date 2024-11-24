'use client'

import { Col, Container, Row, Card, CardBody, CardTitle, Form } from 'react-bootstrap' 
import { useLight } from '../_lib/hooks/useLight'
import { ChangeEvent, useEffect, useState } from 'react'
import { useLights } from '../_lib/hooks/useLights'

export default function ControlCenter() {
  const { data } = useLights()
  const { mutate } = useLight()
  const [lightRowElements, setLightRowElements] = useState<JSX.Element[]>([])

  const handleSwitchChange = (event: ChangeEvent) => {
    const id = event.target.id
    const hueId = id.split('/')[1]
    const checked = (event.target as any).checked as boolean

    console.log('Mutating')

    mutate({ id: hueId, on: checked })
  }

  useEffect(() => {
    console.log('DATA CHANGED', data)

    if (data) {
      const rowCount = data.length / 2
      const remainingLights = data.length % 2

      let leftColumnIndex = 0

      let rowElements: JSX.Element[] = []
  
      for (let row = 1; row <= rowCount; row++) {
        const leftLight = data[leftColumnIndex]
        const rightLight = data[leftColumnIndex + 1]

        const rowElement =
          <Row>
            <Col>
              <Card style={{ width: '18rem' }}>
                <CardBody>
                  <CardTitle>{leftLight.name}</CardTitle>
                  <Form>
                    <Form.Check
                      type='switch'
                      id={`switch/${leftLight.hueId}`}
                      label="Off/On"
                      onChange={handleSwitchChange}
                    />
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card style={{ width: '18rem' }}>
                <CardBody>
                  <CardTitle>{rightLight.name}</CardTitle>
                  <Form>
                    <Form.Check
                      type='switch'
                      id={`switch/${rightLight.hueId}`}
                      label="Off/On"
                      onChange={handleSwitchChange}
                    />
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>

        rowElements = [...rowElements, rowElement]
        leftColumnIndex += 2
      }

      if (remainingLights > 0) {
        const lastLight = data[data.length - 1]

        const lastRowElement =
          <Row>
            <Col>
              <Card style={{ width: '18rem' }}>
                <CardBody>
                  <CardTitle>{lastLight.name}</CardTitle>
                  <Form>
                    <Form.Check
                      type='switch'
                      id={`switch/${lastLight.hueId}`}
                      label="Off/On"
                      onChange={handleSwitchChange}
                    />
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        
        rowElements = [...rowElements, lastRowElement]
      }

      setLightRowElements(rowElements)
    }
  }, [data])

  console.log('Rendering')

  return(
    <>
      <Container>
        {lightRowElements}
      </Container>
    </>
  )
}