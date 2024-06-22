<script setup lang="ts">
import type { EditorBlock } from '#graphql-operations'
import { ref, type Component } from '#imports'

defineProps<{
  block: EditorBlock
  componentToRender: Component
}>()
const showInfo = ref(false)
</script>

<template>
  <div
    class="text-xs my-2"
  >
    <div
      class="lbl-toggle"
      :class="showInfo ? 'expanded' : 'collapsed'"
      @click="showInfo = !showInfo"
    >
      block info: {{ block.name }}
    </div>
    <div
      :class="showInfo ? 'expanded' : 'collapsed'"
      class="pl-3 collapsible-content"
    >
      <strong>render component:</strong> {{ componentToRender.__file }}<br>
      <strong>block data:</strong> {{ block }}<br>
    </div>
  </div>
</template>

<style scoped>
.lbl-toggle {
  cursor: pointer;
  transition: all 0.25s ease-out;
}

.lbl-toggle:hover {
  color: #7C5A0B;
}
.lbl-toggle::before {
  content: ' ';
  display: inline-block;

  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid currentColor;

  vertical-align: middle;
  margin-right: .2rem;
  transform: translateY(-2px);

  transition: transform .2s ease-out;
}
.lbl-toggle.expanded::before {
  transform: rotate(90deg) translateX(-3px);
}

.lbl-toggle.expanded {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.collapsible-content {
  max-height: 0px;
  overflow: hidden;

  transition: max-height .25s ease-in-out;
}
.collapsible-content.expanded {
  max-height: 100vh;
}
</style>
