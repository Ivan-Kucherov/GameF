<template>
  <n-grid :cols="3" class="ft">
    <n-grid-item>
      <div class="mg">
        <Icon icon="ion:moon" />
        <n-switch v-model:value="site.inv" />
      </div>
    </n-grid-item>
  </n-grid>
</template>
<script lang="ts">
import { h, defineComponent, ref, type Component, computed } from 'vue'
import { NIcon } from 'naive-ui'
import { useGlobalStore } from '../stores/GlobalStore'
import { Icon } from '@iconify/vue'

export default defineComponent({
  setup() {
    const site_ = useGlobalStore()
    const site = computed(() => site_.site)
    return {
      site
    }
  },
  components: {
    Icon
  }
})
</script>
<style scoped>
.ft {
  position: absolute;
  bottom: 1em;
  height: 1em;
  border-top: 0.01em solid;
}
.mg {
  padding-left: 1em;
}
</style>