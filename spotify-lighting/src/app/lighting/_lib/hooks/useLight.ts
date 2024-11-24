import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

export type LightProps = {
  id: string
  on: boolean
}

export const useLight = () => {
  return useMutation({
    mutationFn: async (light: LightProps) => axios.put(
      'http://localhost:3000/api/philipshue/updatelight',
      {
        "hueId": light.id,
        "on": light.on
      },
      {
        headers: {
          "hue-application-key": "OanaSPgg-MmwCEUBBPDhQsFXzvQMy3SF5i3wpm4k"
        }
      }
    )
  })
} 