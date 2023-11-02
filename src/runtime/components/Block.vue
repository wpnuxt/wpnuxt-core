<script setup lang="ts">
import type { EditorBlock } from '#graphql-operations';
import CoreParagraphComponent from './blocks/CoreParagraph.vue';
import CoreImageComponent from './blocks/CoreImage.vue';
import CoreGalleryComponent from './blocks/CoreGallery.vue';
import CoreQuoteComponent from './blocks/CoreQuote.vue';
import EditorBlockComponent from './blocks/EditorBlock.vue';

const config = useRuntimeConfig();
const showBlockInfo = config.public.showBlockInfo

const props = defineProps<{
    block: EditorBlock
}>();
const componentToRender = computed(() => {
    if (props.block.parentClientId === null || props.block.parentClientId === undefined) {
        if (props.block.name === 'core/paragraph') return CoreParagraphComponent
        else if (props.block.name === 'core/image') return CoreImageComponent
        else if (props.block.name === 'core/gallery') return CoreGalleryComponent
        else if (props.block.name === 'core/quote') return CoreQuoteComponent
        else return EditorBlockComponent
    } else {
        return undefined
    }
})

</script>

<template>
    <BlockAttr v-if="componentToRender && showBlockInfo" :block="block"/>
    <component v-if="componentToRender" :is="componentToRender" :block="block" />
</template>
