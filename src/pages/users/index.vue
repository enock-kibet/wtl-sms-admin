<script setup lang="ts">
import Instructor from './instructor.vue'
import Students from './students.vue'

const currentTab = ref('students')

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
        <VTabs
          v-model="currentTab"
          class="v-tabs-pill"
        >
          <VTab value="students">
            Students
          </VTab>
          <VTab value="lecturers">
            Lecturers
          </VTab>
          <VTab value="admins">
            Administrators
          </VTab>
        </VTabs>
        <VRow>
          <VCol
            cols="12"
            class="mt-8"
          >
            <VWindow v-model="currentTab">
              <VWindowItem value="students">
                <Students />
              </VWindowItem>
              <VWindowItem value="lecturers">
                <Instructor />
              </VWindowItem>
              <VWindowItem value="admins">
                <Instructor />
              </VWindowItem>
            </VWindow>
          </VCol>
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
