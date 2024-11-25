type Service = {
  rid: string
  rtype: string
}

type Metadata = {
  name: string
}

export type Device = {
  metadata: Metadata
  services: Service[]
}