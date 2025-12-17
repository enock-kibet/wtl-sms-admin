<script setup lang="ts">
import { useTheme } from 'vuetify'
import type { AttendanceGraphModel } from '@/data/models/admin'
import { hexToRgb } from '@layouts/utils'

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:isDrawerOpen', val: boolean): void
}>()

interface Props {
  data: AttendanceGraphModel[]
  isDrawerOpen?: boolean
}

const vuetifyTheme = useTheme()

const currentTab = ref<number>(0)
const refVueApexChart = ref()

const addAcademicYearHandler = () => {
  emit('update:isDrawerOpen', true)
}

const categories = computed(() =>
  props.data.map(item => item.label),
)

const seriesData = computed(() =>
  props.data.map(item => item.count),
)

const chartConfigs = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables

  const labelPrimaryColor = `rgba(${hexToRgb(currentTheme.primary)},${variableTheme['dragged-opacity']})`
  const legendColor = `rgba(${hexToRgb(currentTheme['on-background'])},${variableTheme['high-emphasis-opacity']})`
  const borderColor = `rgba(${hexToRgb(String(variableTheme['border-color']))},${variableTheme['border-opacity']})`
  const labelColor = `rgba(${hexToRgb(currentTheme['on-surface'])},${variableTheme['disabled-opacity']})`

  return Object.entries(props.data).map(([academicYear, records]) => ({
    title: academicYear,
    icon: 'tabler-calendar',
    chartOptions: {
      chart: {
        parentHeightOffset: 0,
        type: 'bar',
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          columnWidth: '42%',
          borderRadiusApplication: 'end',
          borderRadius: 4,
          distributed: true,
          dataLabels: { position: 'top' },
        },
      },
      grid: {
        show: false,
        padding: { left: -10, right: -10 },
      },
      colors: [
        labelPrimaryColor,
        labelPrimaryColor,
        `rgba(${hexToRgb(currentTheme.primary)}, 1)`,
        labelPrimaryColor,
        labelPrimaryColor,
        labelPrimaryColor,
        labelPrimaryColor,
        labelPrimaryColor,
        labelPrimaryColor,
      ],
      dataLabels: {
        enabled: true,
        formatter(val: number) {
          return `${val}`
        },
        offsetY: -25,
        style: {
          fontSize: '15px',
          colors: [legendColor],
          fontWeight: '600',
          fontFamily: 'Public Sans',
        },
      },
      legend: { show: false },
      tooltip: { enabled: false },
      xaxis: {
        categories: records.map(r => r.label),
        axisBorder: { show: true, color: borderColor },
        axisTicks: { show: false },
        labels: {
          style: {
            colors: labelColor,
            fontSize: '13px',
          },
        },
      },
      yaxis: {
        labels: {
          offsetX: -10,
          style: { colors: labelColor },
        },
      },
    },
    series: [
      {
        name: 'Attendance',
        data: records.map(r => r.count),
      },
    ],
  }))
})

const moreList = [
  { title: 'View More', value: 'View More' },
  { title: 'Delete', value: 'Delete' },
]
</script>

<template>
  <VCard
    title="Attendance Reports"
    subtitle="This Year"
  >
    <template #append>
      <div class="mt-n4 me-n2">
        <MoreBtn :menu-list="moreList" />
      </div>
    </template>

    <VCardText>
      <VSlideGroup
        v-model="currentTab"
        show-arrows
        mandatory
        class="mb-10"
      >
        <VSlideGroupItem
          v-for="(report, index) in chartConfigs"
          :key="report.title"
          v-slot="{ isSelected, toggle }"
          :value="index"
        >
          <div
            style="block-size: 100px; inline-size: 110px;"
            :style="isSelected ? 'border-color:rgb(var(--v-theme-primary)) !important' : ''"
            :class="isSelected ? 'border' : 'border border-dashed'"
            class="d-flex flex-column justify-center align-center cursor-pointer rounded py-4 px-5 me-4"
            @click="toggle"
          >
            <VAvatar
              rounded
              size="38"
              :color="isSelected ? 'primary' : ''"
              variant="tonal"
              class="mb-2"
            >
              <VIcon
                size="22"
                :icon="report.icon"
              />
            </VAvatar>
            <h6
              class="text-center font-weight-medium mb-0"
              style=" font-size: 12px;line-height: 12px;"
            >
              {{ report.title }}
            </h6>
          </div>
        </VSlideGroupItem>

        <!-- 👉 slider more -->
        <VSlideGroupItem>
          <div
            style="block-size: 100px; inline-size: 110px;"
            class="d-flex flex-column justify-center align-center rounded border border-dashed py-4 px-5 cursor-pointer"
            @click="addAcademicYearHandler"
          >
            <VAvatar
              rounded
              size="38"
              variant="tonal"
            >
              <VIcon
                size="22"
                icon="tabler-plus"
              />
            </VAvatar>
          </div>
        </VSlideGroupItem>
      </VSlideGroup>

      <VueApexCharts
        ref="refVueApexChart"
        :key="currentTab"
        :options="chartConfigs[Number(currentTab)].chartOptions"
        :series="chartConfigs[Number(currentTab)].series"
        height="230"
        class="mt-3"
      />
    </VCardText>
  </VCard>
  <AcademicYearForm
    v-model:is-drawer-open="isAYHandlerSidebarActive"
    :fetch-academic-years="fetchAcademicYears"
  />
</template>
