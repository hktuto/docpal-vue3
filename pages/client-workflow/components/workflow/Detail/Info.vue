<template>
<div class="info" v-if="taskDetail && taskDetail.taskInstance">
<!--  <h4>{{ $t('workflow_info') }}</h4>-->
  <div class="infoContainer">
    <div class="label">{{ $t('workflow_jobName') }}</div>
    <div class="value">
      {{
        taskDetail.taskInstance.businessKey ||
        taskDetail.taskInstance.processDefinitionName
      }}
    </div>
  </div>
<!--  <h4 class="mg-t">{{ $t('workflow_taskInfo') }}</h4>-->
  <div class="infoContainer">
    <div class="label">{{ $t('workflow_taskName') }}</div>
    <div class="value">
      {{ taskDetail.name }}
    </div>
  </div>
  <div class="infoContainer">
    <div class="label">{{ $t('workflow_assignee') }}</div>
    <div class="value">
      {{ taskDetail.assignee }}
    </div>
  </div>
  <div class="infoContainer">
    <div class="label">{{ $t('workflow_createDate') }}</div>
    <div class="value">
      {{
        formatDate(taskDetail.createDate)
      }}
    </div>
  </div>
  <div class="infoContainer">
    <div class="label">{{ $t('workflow_dueDate') }}</div>
    <div class="value">
      {{
        formatDate(taskDetail.dueDate)
      }}
    </div>
  </div>
  <el-button class="f-g" v-if="isAssigneeUser" type="primary" :loading="loading"
             @click="handleUnclaim">
    {{ $t('workflow_Unclaim') }}
  </el-button>
  <el-button class="f-g" v-else-if="!props.taskDetail.assignee" type="primary" :loading="loading"
             @click="handleClaim">
    {{$t('workflow_claim')}}
  </el-button>
  <el-popover :visible="state.deletePopoverShow" placement="top" :width="160">
    <p>{{$t('msg_confirmWhetherToDelete')}}</p>
    <div class="flex-x-end" style="text-align: right; margin: 0">
      <el-button size="small" text @click="state.deletePopoverShow = false">{{$t('cancelText')}}</el-button>
      <el-button size="small" type="primary" @click="handelDelete">
        {{$t('confirm')}}
      </el-button>
    </div>
    <template #reference>
      <el-button v-if="isStartedUser" @click="state.deletePopoverShow = true">{{$t('common_delete')}}</el-button>
    </template>
  </el-popover>

</div>
</template>
<script lang="ts" setup>
import { taskUnClaimApi, taskClaimApi, taskDeleteApi } from 'dp-api'
import { ElMessage } from 'element-plus'
const emits = defineEmits(['change'])
const props = defineProps<{
    taskDetail: object
}>()

const route = useRoute()
const router = useRouter()
const userId:string = useUser().getUserId()
const state = reactive({
    deletePopoverShow: false,
    loading: false
})
const isStartedUser = computed(() => {
    const id = props.taskDetail.taskInstance.startUserId
    return id === userId
})
const isAssigneeUser = computed(() => {
    const id = props.taskDetail.assignee
    return id === userId
})
async function handleUnclaim () {
    try{
        state.loading = true
        const response = await taskUnClaimApi(route.params.id)
        emits('change', response, false)
        props.taskDetail.assignee = ''
        dpLog({response}, 'handleUnclaim');
    } catch (error) {
        // ElMessage.error(error.response.data.message)
    }
    setTimeout(() => {
        state.loading = false
    }, 200)
}
async function handleClaim () {
    try{
        state.loading = true
        const response = await taskClaimApi(route.params.id, userId)
        if (!response.errorCode) {
            emits('change', response, true)
        }
    } catch (error) {
        // ElMessage.error(error.response.data.message)
    }
    setTimeout(() => {
        state.loading = false
    }, 200)
}
async function handelDelete() {
    const processInstanceId = props.taskDetail.taskInstance.processInstanceId

    const response = await taskDeleteApi(processInstanceId,  userId)
    if(!!response) {
        router.push(`/workflow?tab=${route.query.state}`)
    } else {
        // ElMessage.error(error?.response?.data?.message)
    }
}
</script>
<style lang="scss" scoped>
.info {
    display: flex;
    flex-flow: column nowrap;
    min-width: 180px;
    height: 100%;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    h4{
      margin:0;
    }

    //h4 {
    //    padding: unset;
    //    margin: unset;
    //    margin-bottom: calc(var(--app-padding) / 3);
    //}
    //.mg-t {
    //    margin-top: calc(var(--app-padding) * 3);
    //}
    @media (max-width : 640px) {
      flex-flow: row wrap;
      gap: calc(var(--app-padding) * 2 );
      .f-g {
        flex: 1 0 100%;
      }
    }
}
.infoContainer{
    margin-bottom: var(--app-padding);
}
.label{
    line-height: 1.5rem;
    font-size: 0.7rem;
    color: var(--color-grey-400);
}
.value{
  font-size: 1rem;
}
</style>
