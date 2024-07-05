<script setup lang="ts">
import { useWPUri } from '../composables/useWPUri'
import { useWPContent } from '../composables'
import { useRoute, ref } from '#imports'
import type { EditorBlock, Page } from '#graphql-operations'

const route = useRoute()
const { preview_id: previewId } = route.query

const postEditUrl = useWPUri().postEdit(previewId?.toString() || '')
const page = ref<Page>()
if (previewId) {
  const id = Number.parseInt(previewId.toString())
  const { data } = await useWPContent('PageById', ['page'], false, { id, preview: true })
  page.value = data.value
}
</script>

<template>
  <div style="margin: 3px auto; max-width: 1280px; padding: 30px;">
    <h3>Preview</h3>
    [<NuxtLink :to="postEditUrl">
      edit
    </NuxtLink>]
    <hr style="margin: 15px 0;">
    <h4 style="font-size: larger; font-weight: 700; padding-bottom: 6px;">
      {{ page.title }}
    </h4>
    <BlockRenderer
      v-if="page"
      :blocks="(page?.editorBlocks || []) as EditorBlock[]"
    />
    <div v-else>
      Oops, page === null
    </div>
  </div>
</template>
