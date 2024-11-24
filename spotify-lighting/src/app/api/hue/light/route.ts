import { UpdateLightRequest } from '@/app/types/requests/internal/updateLightRequest'
import { hueApi } from '../api'

export async function PUT(req: Request) {
  const params = (await req.json()) as UpdateLightRequest
  
  await hueApi.put(
    `clip/v2/resource/light/${params.hueId}`,
    {
      "on": {
        "on": params.on
      },
      "xy": {
        "x": params.color?.x,
        "y": params.color?.y
      }
    }
  )

  return new Response('Success', {
    status: 200
  })
}