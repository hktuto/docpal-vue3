<template>
    <div class="activities">
    <div class="activitiesTitle">
      <span class="title">{{ $t('rightDetail_activities') }}</span>
      <!-- <img class="cursorPointer" src="/icons/sort.svg" /> -->
    </div>
    <div class="activitiesDetail">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="displayTime(activity.logDate)"
        >
          <div class="timeline">
            <div class="userOrAction user">{{ activity.username }}</div>
            <div class="userOrAction action">{{ activity.action }}</div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>


<script lang="ts" setup>
import {getActivitiesApi } from 'dp-api'
import dayjs from 'dayjs'
const props = defineProps<{doc: any}>();
const { doc } = toRefs(props);
const activities = ref([])
const { displayTime } = useTime()
const getActivities = async (idOrPath: String) => {
    try {
    const data = await getActivitiesApi(idOrPath)
    return data.sort( (a:any,b:any) => {
            const dateA = dayjs(a.logDate).unix();
            const dateB = dayjs(b.logDate).unix();
            return dateB - dateA;
        })
    } catch(error) {
        dpLog(error)
    return null
    }
}

watch(
    doc,
    async (val:any) => {
        if (val && val.id) {
            activities.value = await getActivities(val.id)
        }
    },
    {
        immediate: true,
    }
)
</script>


<style lang="scss" scoped>
.activities {
  display: flex;
  flex-direction: column;
  height: 100%;

  .activitiesTitle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 0.625rem;
    .title {
      font-family: Roboto;
      font-style: normal;
      font-weight: normal;
      font-size: 1.125rem;
      line-height: 1.375rem;
      color: var(--color-grey-500);
    }
  }
  .activitiesDetail {
    overflow: auto;
    padding: var(--app-padding);
    // max-height: 400px;
    // overflow: auto;
    .timeline {
      display: flex;
      flex-direction: row;
      gap: calc(var(--app-padding) / 2);
      white-space: nowrap;
      font-family: Roboto;
      font-style: normal;
      font-weight: bold;
      color: #ffffff;
      .timestamp {
        background: #17b2c0;
        border-radius: 1.5rem;
        padding: 0.25rem;
        font-size: 0.5rem;
        line-height: 0.5625rem;
      }
      .userOrAction {
        background: var(--color-b2);
        border-radius: 1.5rem;
        padding: 0.25rem 0.75rem;
        font-size: .8rem;
        font-weight: 500;
      }
    }
  }
}
</style>
