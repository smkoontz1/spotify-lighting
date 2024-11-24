import { hueApi } from '../api'

type UpdateLightParams = {
  hueId: string
  on: boolean
}

export async function PUT(req: any) {
  const params = (await req.json()) as UpdateLightParams
  
  await hueApi.put(
    `clip/v2/resource/light/${params.hueId}`,
    {
      "on": { "on": params.on }
    }
  )

  return new Response('Success', {
    status: 200
  })
}