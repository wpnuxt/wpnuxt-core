import { getContentNode } from './useWPContent'

const _useViewer = async () => {
  const { data: viewer } = await getContentNode('Viewer', 'viewer')

  return {
    username: viewer?.username,
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
