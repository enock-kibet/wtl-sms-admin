<script setup lang="ts">
import { AttendanceGraphModel, DashStats } from '@/data/models/admin';
import AcademicYearForm from '@/views/modal/AcademicYearForm.vue';
import AttendanceGraph from '@/views/pages/cards/AttendanceGraph.vue';


const isAYHandlerSidebarActive = ref(false);

const userData = <any>useCookie('userData').value || {};

const { data: statsData, execute: fetchStats } = await useApi<any>(createUrl('/administrator/dash-stats'));

const stats = computed((): DashStats => statsData.value.data)

const { data: graphData, execute: fetchGraph } = await useApi<any>(createUrl('/administrator/attendance-graph'));


const graphStats = computed((): AttendanceGraphModel[] => graphData.value.data)

const statisticsHorizontal = [
  {
    title: 'All Students',
    color: 'primary',
    icon: 'tabler-user',
    stats: `${stats.value?.students}` || '0',
  },
  {
    title: 'Attendance',
    color: 'success',
    icon: 'tabler-user-check',
    stats: `${stats.value?.attendances}` || '0',
  },
  {
    title: 'Graduates List',
    color: 'warning',
    icon: 'tabler-school',
    stats: `${stats.value?.graduates}` || '0',
  },
  {
    title: 'Quality of Grades',
    color: 'success',
    icon: 'tabler-user-star',
    stats: `${stats.value?.quality_grades}` || '0',
  },
  {
    title: 'Fails',
    color: 'error',
    icon: 'tabler-user-x',
    stats: `${stats.value?.fails}` || '0',
  },
]
</script>

<template>
  <div>
    <VRow>
      <VCol
        cols="12"
        md="12"
      >
        <h4 class="text-h4">Hello {{ userData?.fullName }}</h4>
        <p class="mb-0">Here’s an overview of the attendance at the campus</p>
      </VCol>
      <VCol
        cols="12"
        md="12"
      >
        <VRow class="match-height">
          <VCol
            v-for="statistics in statisticsHorizontal"
            :key="statistics.title"
          >
            <CardStatisticsHorizontal v-bind="statistics" />
          </VCol>
        </VRow>
        <VRow class="match-height">
          <VCol
            cols="12"
            md="12"
          >
            <div>
              <h4 class="text-h5 mb-0">Report Chart</h4>
            </div>
          </VCol>
          <VCol
            cols="12"
            md="9"
          >
            <template v-if="graphStats.length > 0">
              <AttendanceGraph :data="graphStats" v-model:is-drawer-open="isAYHandlerSidebarActive" />
            </template>
            <template v-else>
            <VCol
              cols="12"
              md="12"
            >
              <VAlert
                color="primary"
                variant="tonal"
              >
                You do not have any stats at the moment, check again later!
              </VAlert>
            </VCol>
          </template>
          </VCol>
          <VCol
            cols="12"
            md="3"
          >
            <AttendanceStatus />
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </div>

   <AcademicYearForm
    v-model:is-drawer-open="isAYHandlerSidebarActive"
    :fetch-academic-years="fetchGraph"
  />
</template>
