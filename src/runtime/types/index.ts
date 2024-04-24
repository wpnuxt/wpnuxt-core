import type { Ref } from 'vue'

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
  error: Ref<GraphqlError<T> | null>
}

export interface GraphqlError<T> extends Error {
  data?: T
  status?: number
  statusText?: string
  statusCode?: number
  statusMessage?: string
}

// Ensure that a .js file is emitted too
export {}
