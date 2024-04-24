import type { FetchError } from 'ofetch'

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

export type GraphqlResponse<WPContent> = {
  data: WPContent
  errors: FetchError[]
}

export interface WPContent {
  data
}

export interface WPContentQueryParams {
  id?: number
  asPreview?: boolean
  name?: string
  uri?: string
}

// Ensure that a .js file is emitted too
export {}
