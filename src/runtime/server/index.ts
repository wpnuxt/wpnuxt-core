export function usePosts() {
  return $fetch('/api/wpContent', {
    method: 'POST',
    body: {
      queryName: 'Posts'
    }
  })
}
