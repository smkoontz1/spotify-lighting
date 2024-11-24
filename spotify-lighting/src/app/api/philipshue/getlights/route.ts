import { hueApi } from '../api'

export async function GET(req: Request) {
  const response = await hueApi.get('clip/v2/resource/device')
  const responseJson = JSON.stringify(response.data)

  return new Response(responseJson, {
    status: 200
  })
}