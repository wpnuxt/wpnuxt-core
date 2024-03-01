import { useRuntimeConfig } from "#imports"

const _useWPUri = () => {

  const config = useRuntimeConfig()
  const base = config.public.wpNuxt.wordpressUrl
  const admin = base + '/wp-admin'
  const pagesAdmin = base + '/wp-admin/edit.php?post_type=page'
  const postAdmin = base + '/wp-admin/edit.php?post_type=post'
  const settingsEdit = base + '/wp-admin/options-general.php'
  const postEdit = (path: string) => {
    if (path)
      return base + '/wp-admin/post.php?post=' + path + '&action=edit'
    else return postAdmin
  }

  return {
    base,
    admin,
    pagesAdmin,
    postAdmin,
    postEdit,
    settingsEdit
  }
}

export const useWPUri = _useWPUri
