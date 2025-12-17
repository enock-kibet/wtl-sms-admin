<script lang="ts" setup>
import UserInvoiceTable from './UserInvoiceTable.vue'

// Images

// Project Table Header
const projectTableHeaders = [
  { title: 'PROJECT', key: 'project' },
  { title: 'LEADER', key: 'leader' },
  { title: 'Team', key: 'team' },
  { title: 'PROGRESS', key: 'progress' },
  { title: 'Action', key: 'Action', sortable: false },
]

const search = ref('')

const options = ref({ itemsPerPage: 5, page: 1 })

const moreList = [
  { title: 'Download', value: 'Download' },
  { title: 'Delete', value: 'Delete' },
  { title: 'View', value: 'View' },
]
</script>

<template>
  <VRow>
    <VCol cols="12">
      <p>Coming soon</p>
    </VCol>
  </VRow>
</template>
