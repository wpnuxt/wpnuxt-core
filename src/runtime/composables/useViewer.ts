import { getContentNode } from './useWPContent'
import type { ViewerQuery } from '#graphql-operations'

const _useViewer = async (): Promise<ViewerQuery | undefined> => {
  const viewer = await getContentNode<ViewerQuery>('Viewer', 'viewer')
  if (!viewer) return undefined

  return {
    username: viewer?.username,
    userId: viewer?.userId,
    id: viewer?.id,
    email: viewer?.email,
    description: viewer?.description,
    firstName: viewer?.firstName,
    lastName: viewer?.lastName,
    locale: viewer?.locale,
    url: viewer?.url,
    uri: viewer?.uri,
  }
}

export const useViewer = _useViewer
