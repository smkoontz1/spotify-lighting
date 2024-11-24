import axios from 'axios'
import https from 'https'

const hueBridgeIp = '192.168.0.3'

export const hueApi = axios.create({
  baseURL: `https://${hueBridgeIp}/`,
  headers: {
    "hue-application-key": "OanaSPgg-MmwCEUBBPDhQsFXzvQMy3SF5i3wpm4k"
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  })
})