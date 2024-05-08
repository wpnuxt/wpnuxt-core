import type { FetchError } from 'ofetch'
import { getContentNode } from './useWPContent'
import type { Viewer } from '#graphql-operations'
import type { AsyncData } from '#app'

const _useViewer = async (): Promise<AsyncData<Viewer, FetchError | null>> => {
  return await getContentNode<Viewer>('Viewer', 'viewer')
}

export const useViewer = _useViewer
