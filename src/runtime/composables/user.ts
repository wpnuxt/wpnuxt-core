import { useLocalStorage } from '@vueuse/core'
import type { Viewer } from '#graphql-operations'

const currentUserId = useLocalStorage<number>('CURRENT_USER_ID', null)
const currentUserName = useLocalStorage<string>('CURRENT_USER_NAME', null)

export async function loginUser(): Promise<string> {
  const { data: viewer } = await <Viewer>useViewer()
  if (viewer.value) {
    currentUserId.value = viewer.userId
    if (viewer.value.firstName === undefined || viewer.value.firstName === null || viewer.value.firstName === '') {
      currentUserName.value = viewer.value.username
    } else {
      currentUserName.value = viewer.value.firstName
    }
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
