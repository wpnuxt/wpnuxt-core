<script setup lang="ts">
import { useRoute, ref } from '#imports';
import type { EditorBlock, Page } from '#graphql-operations';
import { useWPUri } from '../composables/useWPUri';
import { usePageById } from '../composables/usePages';
const route = useRoute();
const { preview_id: previewId } = route.query;

const postEditUrl = useWPUri().postEdit(previewId?.toString() || '');
const page = ref<Page>()
if (previewId) {
  const id = Number.parseInt(previewId.toString());
  const data = await usePageById(id, true)
  page.value = data?.data
}
</script>

<template>
  <div>
    <h3>Preview</h3>
    [<NuxtLink :to="postEditUrl">
      edit
    </NuxtLink>]
    <hr>
    <BlockRenderer
      v-if="page"
      :blocks="(page?.editorBlocks || []) as EditorBlock[]"
    />
    <div v-else>
      Oops, page === null
    </div>
  </div>
</template>
