import { UpdateLightRequest } from '@/app/lighting/_types/requests/internal/updateLightRequest'
import { hueApi } from '../api'

export async function PUT(req: Request) {
  const params = (await req.json()) as UpdateLightRequest
  
  const response = await hueApi.put(
    `clip/v2/resource/light/${params.hueId}`,
    {
      "on": {
        "on": params.on
      },
      "color": {
        "xy": {
          "x": params.color?.x,
          "y": params.color?.y
        }
      }
    }
  )

  if (response.status === 200) {
    return new Response('Success', {
      status: 200
    })
  } else {
    return new Response('Problem', {
      status: response.status
    })
  }
}