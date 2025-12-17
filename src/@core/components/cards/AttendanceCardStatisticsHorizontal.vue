<script setup lang="ts">
interface Props {
  title: string
  color?: string
  icon: string
  stats: string
  isHover?: boolean
  navKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
})

const emit = defineEmits<{
  (e: 'update:navKey', val: string): void
}>()

const iState = ref(props.isHover)

const setNavKey = (key: string) => {
  alert(`Navigation Key: ${props.navKey}`)
  if (props.navKey)
    emit('update:navKey', key)
}
</script>

<template>
  <div>
    <VCard
      class="logistics-card-statistics cursor-pointer"
      :style="iState ? `border-block-end-color: rgb(var(--v-theme-primary))` : `border-block-end-color: rgba(var(--v-theme-primary),0.38)`"
      @mouseenter="iState = true"
      @mouseleave="iState = false"
      @click="setNavKey(props.navKey!)"
    >
      <VCardText class="d-flex align-center justify-space-between">
        <div>
          <div class="text-subtitle-1">
            {{ props.title }}
          </div>
          <div class="d-flex align-center flex-wrap">
            <h5 class="text-h5">
              {{ props.stats }}
            </h5>
          </div>
        </div>

        <VAvatar
          :color="props.color"
          :size="42"
          rounded
          variant="tonal"
        >
          <VIcon
            :icon="props.icon"
            size="26"
          />
        </VAvatar>
      </VCardText>
    </VCard>
  </div>
</template>
