export interface ModuleOptions {
  wordpressUrl: string
  stagingUrl: string
  frontendUrl: string
  faustSecretKey?: string
  defaultMenuName?: string
  showBlockInfo?: boolean
  debug?: boolean
  trace?: boolean
  replaceSchema?: boolean
  enableCache?: boolean
  staging?: boolean
}

export interface GraphqlResponse<T> {
  data: T
  errors: GraphqlError<T>[]
}

export interface GraphqlError<T> extends Error {
  data?: T
  status?: number
  statusText?: string
  statusCode?: number
  statusMessage?: string
}

export interface WPContentQueryParams {
  id?: number
  asPreview?: boolean
  name?: string
  uri?: string
}

// Ensure that a .js file is emitted too
export {}
