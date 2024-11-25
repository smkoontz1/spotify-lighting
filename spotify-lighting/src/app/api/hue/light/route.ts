import { UpdateLightRequest } from '@/app/types/requests/internal/updateLightRequest'
import { hueApi } from '../api'

export async function PUT(req: Request) {
  const params = (await req.json()) as UpdateLightRequest
  
  console.log(params)

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

  console.log(response.request)

  return new Response('Success', {
    status: 200
  })
}