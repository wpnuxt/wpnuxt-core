import type { FetchError } from 'ofetch'
import { getContentNodes } from './useWPContent'
import type { Revisions } from '#graphql-operations'
import type { AsyncData } from '#app'

const _useRevisions = async (): Promise<AsyncData<Revisions | null, FetchError | null>> => {
  return await getContentNodes<Revisions[]>('Revisions')
}

export const useRevisions = _useRevisions
