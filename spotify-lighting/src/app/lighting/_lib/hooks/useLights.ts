import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type Service = {
  rid: string
  rtype: string
}

type Metadata = {
  name: string
}

type Device = {
  metadata: Metadata
  services: Service[]
}

type Light = {
  name: string
  hueId: string
}

export const useLights = () => {
  return useQuery<Light[]>({
    queryKey: ['device-lights'],
    queryFn: async () => {
      const deviceResponse = await axios.get('http://localhost:3000/api/philipshue/getlights')

      const devices = deviceResponse.data.data as Device[]
      const lightDevices = devices.filter(d => d.services.some(s => s.rtype === 'light'))
      
      console.log('LIGHTS', lightDevices)

      return lightDevices.map(ld => <Light>{
        name: ld.metadata.name,
        hueId: ld.services.find(s => s.rtype === 'light')?.rid
      })
    }
  })
}