import { useLocalStorage } from '@vueuse/core'
import { useViewer } from './useViewer'
import type { Viewer } from '#graphql-operations'

const currentUserId = useLocalStorage<number>('CURRENT_USER_ID', null)
const currentUserName = useLocalStorage<string>('CURRENT_USER_NAME', null)

export async function loginUser(): Promise<string> {
  const { data: viewer } = await <Viewer>useViewer()
  currentUserId.value = viewer.userId
  if (viewer.firstName === undefined || viewer.firstName === null || viewer.firstName === '') {
    currentUserName.value = viewer.username
  } else {
    currentUserName.value = viewer.firstName
  }
  return currentUserName.value
}

export function logoutUser() {
  currentUserId.value = undefined
  currentUserName.value = undefined
}

export function getCurrentUserId(): number {
  return currentUserId.value
}

export function getCurrentUserName(): string {
  return currentUserName.value
}
