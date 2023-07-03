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
          :timestamp="displayTime(activity.envetDateStr)"
        >
          <div class="timeline">
            <div class="userOrAction user">{{ activity.principalName }}</div>
            <div class="userOrAction action">{{ $t(activity.eventId) }}</div>
          </div>
        </el-timeline-item>
        <template v-if="activities.length < totalSize">
          <el-button type="link" @click="loadMore">{{$t('loadMore')}}</el-button>
        </template>
      </el-timeline>
    </div>
  </div>
</template>


<script lang="ts" setup>
import {getAuditClientApi, AuditClientParams } from 'dp-api'
import dayjs from 'dayjs'
const props = defineProps<{doc: any}>();
const { doc } = toRefs(props);
const activities = ref<any[]>([])
const { displayTime } = useTime()
const params = reactive<AuditClientParams>({
    pageNum: 0,
    pageSize: 20,
    documentId: doc.value.id,
})
const totalSize = ref(0);
const pageNum = ref(0);
const pageSize = ref(50);
const canLoadMore = ref(false);
const loadMore = async() => {
    pageNum.value += 1;
    params.pageNum = pageNum.value;
    await getActivities()
}
const getActivities = async () => {
    try {
    const data = await getAuditClientApi(params)
    console.log('data', data)
    totalSize.value = data.totalSize;
    activities.value.push(...data.entryList);
    // return data.sort( (a:any,b:any) => {
    //         const dateA = dayjs(a.logDate).unix();
    //         const dateB = dayjs(b.logDate).unix();
    //         return dateB - dateA;
    //     })
    } catch(error) {
        console.log(error)
        return null
    }
}

watch(
    doc,
    async (val:any) => {
        if (val && val.id) {
          activities.value = [];
          pageNum.value = 0;
          canLoadMore.value = false;
          await getActivities()
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
