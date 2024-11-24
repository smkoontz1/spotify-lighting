import { UpdateLightRequest } from '@/app/types/requests/internal/updateLightRequest'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

export const useLightPut = () => {
  return useMutation({
    mutationFn: async (req: UpdateLightRequest) => axios.put(
      'http://localhost:3000/api/hue/light',
      req,
      {
        headers: {
          "hue-application-key": "OanaSPgg-MmwCEUBBPDhQsFXzvQMy3SF5i3wpm4k"
        }
      }
    )
  })
} 