<script setup lang="ts">
import Instructor from './instructor.vue'
import Students from './students.vue'

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
            v-for="statistics in statisticsHorizontal"
            :key="statistics.title"
          >
            <div>
              <VCard
                class="logistics-card-statistics cursor-pointer"
                :style="statistics.isHover ? `border-block-end-color: rgb(var(--v-theme-primary))` : `border-block-end-color: rgba(var(--v-theme-primary),0.38)`"
                @mouseenter="statistics.isHover = true"
                @mouseleave="statistics.isHover = false"
                @click="setNavKey(statistics.key!)"
              >
                <VCardText class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-subtitle-1">
                      {{ statistics.title }}
                    </div>
                    <div class="d-flex align-center flex-wrap">
                      <h5 class="text-h5">
                        {{ statistics.stats }}
                      </h5>
                    </div>
                  </div>

                  <VAvatar
                    :color="statistics.color"
                    :size="42"
                    rounded
                    variant="tonal"
                  >
                    <VIcon
                      :icon="statistics.icon"
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
              <Students />
            </VCol>
          </template>
          <template v-else-if="navKey === 'lecturers'">
            <VCol
              cols="12"
              md="12"
            >
              <Instructor />
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
