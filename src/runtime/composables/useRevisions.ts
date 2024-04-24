import { getContentNodes } from './useWPContent'
import type { RevisionsQuery } from '#graphql-operations'

const _useRevisions = async () => {
  return getContentNodes<RevisionsQuery>('Revisions')
}

export const useRevisions = _useRevisions
