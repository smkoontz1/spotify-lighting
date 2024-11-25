import { LightResponse } from '@/app/lighting/_types/responses/external/hue/light'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useLights = () => {
  return useQuery<LightResponse[]>({
    queryKey: ['lights'],
    queryFn: async () => {
      const response = await axios.get<LightResponse[]>('http://localhost:3000/api/hue/lights')

      return response.data
    }
  })
}