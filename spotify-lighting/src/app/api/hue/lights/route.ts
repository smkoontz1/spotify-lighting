import { Device } from '@/app/types/responses/external/hue/device'
import { hueApi } from '../api'
import { LightResponse } from '@/app/types/responses/external/hue/light'

export async function GET(req: Request) {
  const response = await hueApi.get('clip/v2/resource/device')
  const devices = response.data.data as Device[]
  const lightDevices = devices.filter(d => d.services.some(s => s.rtype === 'light'))
  const lightIds = lightDevices.map(d => d.services.find(s => s.rtype === 'light')?.rid)

  const lightPromises = lightIds.map(id => hueApi.get(`clip/v2/resource/light/${id}`))
  const lightResponses = await Promise.all(lightPromises)
  const lights = lightResponses.map(r => r.data.data[0] as LightResponse)

  return new Response(JSON.stringify(lights), {
    status: 200
  })
}