<script setup lang="ts">
import type { Courses } from '@/data/models/courses'
import type { Topic, iTopic } from '@/data/models/topics'
import TopicSideForm from '@/views/modal/TopicSideForm.vue'

const isTopicHandlerSidebarActive = ref(false)

const selectedStatus = ref()
const selectedCategory = ref()
const selectedStock = ref<boolean | undefined>()
const searchQuery = ref('')
const selectedRows = ref([])

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const selectedTopic = ref<iTopic>({
  id: undefined,
  course_id: undefined,
  semester: undefined,
  title: undefined,
  description: undefined,
  status: undefined,
})

const { data: topicsData, execute: fetchTopics } = await useApi<any>(createUrl('/administrator/topics',
  {
    query: {
      q: searchQuery,
      stock: selectedStock,
      category: selectedCategory,
      status: selectedStatus,
      page,
      itemsPerPage,
      sortBy,
      orderBy,
    },
  },
))

const topics = computed((): Topic[] => topicsData.value.data)
const totalTopics = computed(() => topicsData.value.total)

const deleteTopic = async (id: string) => {
  await $api(`apps/ecommerce/products/${id}`, {
    method: 'DELETE',
  })

  // Delete from selectedRows
  const index = selectedRows.value.findIndex(row => row === id)
  if (index !== -1)
    selectedRows.value.splice(index, 1)

  // Refetch products
  fetchTopics()
}

const addTopic = () => {
  selectedTopic.value = {
    id: undefined,
    course_id: undefined,
    semester: undefined,
    title: undefined,
    description: undefined,
    status: undefined,
  }
  isTopicHandlerSidebarActive.value = true
}

const editTopic = (topic: iTopic) => {
  selectedTopic.value = topic
  isTopicHandlerSidebarActive.value = true
}

const { data: coursesData } = await useApi<any>(createUrl('/course/list',
  {
    query: {
      q: searchQuery,
      stock: selectedStock,
      category: selectedCategory,
      status: selectedStatus,
      page,
      itemsPerPage,
      sortBy,
      orderBy,
    },
  },
))

const courses = computed((): Courses[] => coursesData.value.data)

const headers = [
  { title: 'Course', key: 'course' },
  { title: 'Semester', key: 'semester' },
  { title: 'Title', key: 'title' },
  { title: 'Description', key: 'description' },
  { title: 'Status', key: 'status' },

  // { title: 'Fails', key: 'fails' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const resolveStatus = (statusMsg: string) => {
  if (statusMsg === 'active')
    return { text: 'Active', color: 'success' }
  if (statusMsg === 'inactive')
    return { text: 'Inactive', color: 'error' }

  return { text: statusMsg, color: 'default' }
}
</script>

<template>
  <div>
    <VRow>
      <VCol
        cols="12"
        md="12"
      >
        <VCard
          title="Filter Topics"
          class="mb-6"
        >
          <VDivider />

          <div class="d-flex flex-wrap gap-4 ma-6">
            <div class="d-flex align-center">
              <!-- 👉 Search  -->
              <AppTextField
                v-model="searchQuery"
                placeholder="Search Topic"
                style="inline-size: 200px;"
                class="me-3"
              />
            </div>

            <VSpacer />
            <div class="d-flex gap-4 flex-wrap align-center">
              <AppSelect
                v-model="itemsPerPage"
                :items="[5, 10, 20, 25, 50]"
              />
              <!-- 👉 Export button -->
              <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="tabler-upload"
              >
                Export
              </VBtn>

              <VBtn
                color="primary"
                prepend-icon="tabler-plus"
                @click="addTopic"
              >
                Add Topic
              </VBtn>
            </div>
          </div>

          <VDivider class="mt-4" />

          <!-- 👉 Datatable  -->
          <VDataTableServer
            v-model:items-per-page="itemsPerPage"
            v-model:model-value="selectedRows"
            v-model:page="page"
            :headers="headers"
            show-select
            :items="topics"
            :items-length="totalTopics"
            class="text-no-wrap"
            @update:options="updateOptions"
          >
            <!-- description -->
            <template #item.description="{ item }">
              <div>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="item.description" />
              </div>
            </template>

            <!-- status -->
            <template #item.status="{ item }">
              <VChip
                v-bind="resolveStatus(item.status)"
                density="default"
                label
                size="small"
              />
            </template>

            <!-- Actions -->
            <template #item.actions="{ item }">
              <IconBtn @click="editTopic(item)">
                <VIcon icon="tabler-edit" />
              </IconBtn>

              <IconBtn>
                <VIcon icon="tabler-dots-vertical" />
                <VMenu activator="parent">
                  <VList>
                    <VListItem
                      value="download"
                      prepend-icon="tabler-download"
                    >
                      Download
                    </VListItem>

                    <VListItem
                      value="delete"
                      prepend-icon="tabler-trash"
                      @click="deleteTopic(item.id)"
                    >
                      Delete
                    </VListItem>

                    <VListItem
                      value="duplicate"
                      prepend-icon="tabler-copy"
                    >
                      Duplicate
                    </VListItem>
                  </VList>
                </VMenu>
              </IconBtn>
            </template>

            <!-- pagination -->
            <template #bottom>
              <TablePagination
                v-model:page="page"
                :items-per-page="itemsPerPage"
                :total-items="totalTopics"
              />
            </template>
          </VDataTableServer>
        </VCard>
      </VCol>
    </VRow>
  </div>
  <TopicSideForm
    v-model:is-drawer-open="isTopicHandlerSidebarActive"
    v-model:topic-data="selectedTopic"
    :fetch-topics="fetchTopics"
    :courses-data="courses"
  />
</template>
