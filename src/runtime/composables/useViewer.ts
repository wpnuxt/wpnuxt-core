import { getContentNode } from './useWPContent'
import type { ViewerQuery } from '#graphql-operations'
import { ref } from '#imports'

const _useViewer = async () => {
  const { data } = await getContentNode<ViewerQuery>('Viewer', 'viewer')
  const viewer = ref<ViewerQuery>(data)

  return {
    username: viewer.value?.username,
    userId: viewer.value?.userId,
    id: viewer.value?.id,
    email: viewer.value?.email,
    description: viewer.value?.description,
    firstName: viewer.value?.firstName,
    lastName: viewer.value?.lastName,
    locale: viewer.value?.locale,
    url: viewer.value?.url,
    uri: viewer.value?.uri,
  }
}

export const useViewer = _useViewer
