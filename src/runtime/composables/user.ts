
import { useViewer, useLocalStorage } from "#imports"
const currentUserId = useLocalStorage<Number>('CURRENT_USER_ID', null)
const currentUserName = useLocalStorage<String>('CURRENT_USER_NAME', null)

export async function loginUser(): Promise<String> {
  const viewer = await useViewer()
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

export function getCurrentUserId(): Number {
  return currentUserId.value
}

export function getCurrentUserName(): String {
  return currentUserName.value
}
