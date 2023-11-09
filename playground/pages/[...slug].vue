
<script setup lang="ts">
const route = useRoute();
const viewer = await useViewer()
const post = await usePostByUri(route.params.slug[0])
const wpUri = useWPUri()
if (post?.data?.title) {
    useHead({
        title: post.data.title
    })
}
</script>
<template>
  <UContainer>
    <UPage v-if="post?.data">
      <UPageHeader :title="post.data.title" />
      <UPageBody>
        <BlockRenderer
          v-if="post.data.editorBlocks"
          :blocks="post.data.editorBlocks"
        />
      </UPageBody>
      <template #left>
        <UAside>
          <UButton
            icon="i-heroicons-arrow-left"
            variant="soft"
            size="sm"
            to="/"
          />
          <div
            v-if="post.data.featuredImage?.node?.sourceUrl"
            class="test-sm mt-10"
          >
            featured image:
            <ImageComponent
              :url="post.data.featuredImage?.node?.sourceUrl"
              class="rounded-lg shadow-md mt-2"
            />
          </div>
          <div class="test-sm mt-10">
            published:
            {{ post.data.date.split('T')[0] }}
          </div>
          <div
            v-if="viewer?.username"
            class="test-sm mt-5"
          >
            <UButton
              size="xs"
              icon="i-heroicons-pencil"
              :to="wpUri.postEdit(post.data.databaseId)"
            />
          </div>
        </UAside>
      </template>
    </UPage>
  </UContainer>
</template>
