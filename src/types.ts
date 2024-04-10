export interface ModuleOptions {
  wordpressUrl: string
  stagingUrl: string
  frontendUrl: string
  faustSecretKey?: string
  defaultMenuName?: string
  showBlockInfo?: boolean
  debug?: boolean
  replaceSchema?: boolean
  enableMultiCache?: boolean
}

export type GraphqlResponse<T> = {
  data: T
  errors: any[]
}
