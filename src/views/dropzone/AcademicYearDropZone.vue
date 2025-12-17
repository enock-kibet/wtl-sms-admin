<script setup lang="ts">
import { useDropZone, useFileDialog, useObjectUrl } from '@vueuse/core'

const props = defineProps<{
  modelValue: File | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | null): void
}>()

const dropZoneRef = ref<HTMLDivElement>()

interface FileData {
  file: File
  url: string
}

const fileData = ref<FileData[]>([])
const { open, onChange } = useFileDialog({ accept: 'image/*' })

function addSingleFile(file: File) {
  const url = useObjectUrl(file).value || ''

  fileData.value = [{ file, url }]

  // send to parent
  emit('update:modelValue', file)
}

function onDrop(files: File[] | null) {
  const file = files?.[0]
  if (!file)
    return
  if (!file.type.startsWith('image/')) {
    alert('Only image files are allowed')

    return
  }
  addSingleFile(file)
}

onChange(files => {
  const file = files?.[0]
  if (!file)
    return
  addSingleFile(file)
})

useDropZone(dropZoneRef, onDrop)

watch(() => props.modelValue, val => {
  if (!val)
    fileData.value = []
})
</script>

<template>
  <div class="w-full text-center">
    <div
      ref="dropZoneRef"
      class="cursor-pointer"
      @click="open"
    >
      <!-- EMPTY STATE -->
      <div
        v-if="fileData.length === 0"
        class="drop-zone flex flex-col justify-center items-center gap-3 pa-6 rounded-md"
      >
        <VIcon
          icon="tabler-upload"
          size="40"
          class="text-medium-emphasis"
        />
        <div class="text-center">
          <h4 class="text-h6 font-weight-medium">
            Upload an image
          </h4>
          <p class="text-caption text-disabled">
            Drag & drop or click to browse
          </p>
        </div>

        <VBtn
          variant="tonal"
          size="small"
        >
          Browse
        </VBtn>
      </div>

      <!-- PREVIEW GRID -->
      <div
        v-else
        class="drop-zone p-4 rounded-md flex flex-col gap-3"
      >
        <div
          class="grid gap-3"
          style="grid-template-columns: 1fr;"
        >
          <VCard
            v-for="(item, i) in fileData"
            :key="i"
            class="rounded-lg overflow-hidden"
            :ripple="false"
          >
            <VImg
              :src="item.url"
              height="140"
              class="w-full object-cover"
            />

            <div class="px-3 py-2 text-truncate">
              <div class="font-weight-medium text-body-2 text-wrap">
                {{ item.file.name }}
              </div>
              <div class="text-caption text-disabled">
                {{ item.file.size / 1000 }} KB
              </div>
            </div>

            <VBtn
              variant="text"
              class="text-error"
              block
              @click.stop="fileData.splice(i, 1)"
            >
              Remove
            </VBtn>
          </VCard>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.drop-zone {
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.3);
  transition: 0.2s ease;
}

.drop-zone:hover {
  border-color: rgba(var(--v-theme-primary), 0.6);
  background-color: rgba(var(--v-theme-primary), 0.05);
}
</style>
