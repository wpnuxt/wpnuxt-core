import { getContentNodes } from './useWPContent'
import type { Revisions } from '#graphql-operations'

const _useRevisions = async () => {
  return await getContentNodes<Revisions[]>('Revisions')
}

export const useRevisions = _useRevisions
