<script setup lang="ts">
import Evaluation from './evaluation.vue'
import Instructor from './instructor.vue'
import type { AcademicYear } from '@/data/models/schools'

const { data: academicYearsData, execute: fetchAcademicYears } = await useApi<any>(createUrl('/academic-year/list'))

const academicYears = computed((): AcademicYear[] => academicYearsData.value.data)

console.log(academicYears.value)

const statisticsHorizontal = [
  {
    title: 'All Students',
    color: 'primary',
    icon: 'tabler-school',
    stats: '21,459',
    key: 'students',
    isHover: false,
  },
  {
    title: 'All Lectures',
    color: 'success',
    icon: 'tabler-users',
    stats: '50',
    key: 'lecturers',
    isHover: false,
  },
  {
    title: 'Graduates List',
    color: 'warning',
    icon: 'tabler-user-exclamation',
    stats: '200',
    isHover: false,
  },
  {
    title: 'Quality of Grades',
    color: 'success',
    icon: 'tabler-user-check',
    stats: 'Av B+',
    isHover: false,
  },
  {
    title: 'Fails',
    color: 'error',
    icon: 'tabler-school-off',
    stats: 'Av B+',
    isHover: false,
  },
]

const navKey = ref('students')

watch(navKey, val => {
  console.log('Navigation Key changed to:', val)
})

const setNavKey = (key: string) => {
  if (key)
    navKey.value = key
}
</script>

<template>
  <div>
    <VRow>
      <VCol
        cols="12"
        md="12"
      >
        <VRow class="match-height">
          <VCol
            v-for="statistics in academicYears"
            :key="statistics.id"
            cols="12"
            md="3"
          >
            <div>
              <VCard
                class="logistics-card-statistics cursor-pointer"
                style="border-block-end-color: rgba(var(--v-theme-primary), 0.38);"
                @click="setNavKey(statistics.key!)"
              >
                <VCardText class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-subtitle-1">
                      {{ statistics.start_date }} - {{ statistics.end_date }}
                    </div>
                    <div class="d-flex align-center flex-wrap">
                      <h5 class="text-h5">
                        {{ statistics.name }}
                      </h5>
                    </div>
                  </div>

                  <VAvatar
                    color="primary"
                    :size="42"
                    rounded
                    variant="tonal"
                  >
                    <VIcon
                      icon="tabler-calendar"
                      size="26"
                    />
                  </VAvatar>
                </VCardText>
              </VCard>
            </div>
          </VCol>
        </VRow>
        <VRow class="match-height">
          <template v-if="navKey === 'students'">
            <VCol
              cols="12"
              md="12"
            >
              <Evaluation />
            </VCol>
          </template>
        </VRow>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss" scoped>
@use "@core/scss/base/mixins" as mixins;

.logistics-card-statistics {
  border-block-end-style: solid;
  border-block-end-width: 2px;

  &:hover {
    border-block-end-width: 3px;
    margin-block-end: -1px;

    @include mixins.elevation(8);

    transition: all 0.1s ease-out;
  }
}

.skin--bordered {
  .logistics-card-statistics {
    border-block-end-width: 2px;

    &:hover {
      border-block-end-width: 3px;
      margin-block-end: -2px;
      transition: all 0.1s ease-out;
    }
  }
}
</style>
