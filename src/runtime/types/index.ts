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

export type GraphqlResponse<T> = {
  data: T
  errors: any[]
}

export interface WordPressContent {
}

// Ensure that a .js file is emitted too
export {}
