<template>
<div class="info" v-if="taskDetail">
    <h4>{{ $t('workflow_info') }}</h4>
    <div class="infoContainer">
        <div class="label">{{ $t('workflow_jobName') }}</div>
        <div class="value">
            {{
                taskDetail.businessKey ||
                taskDetail.processDefinitionName
            }}
        </div>
    </div>
    <h4 class="mg-t">{{ $t('workflow_taskInfo') }}</h4>
    <div class="infoContainer">
        <div class="label">{{ $t('workflow_taskName') }}</div>
        <div class="value">
            {{ taskDetail.processDefinitionName }}
        </div>
    </div>

    <div class="infoContainer">
        <div class="label">{{ $t('workflow_startTime') }}</div>
        <div class="value">
            {{
                formatDate(taskDetail.startTime)
            }}
        </div>
    </div>
    <div class="infoContainer" v-if="state === 'completeTask'">
        <div class="label">{{ $t('tableHeader_completeDate') }}</div>
        <div class="value">
            {{
                formatDate(taskDetail.endTime)
            }}
        </div>
    </div>
</div>
</template>
<script lang="ts" setup>
const props = defineProps<{
    taskDetail: object,
    state: string
}>()
</script>
<style lang="scss" scoped>
.info {
    min-width: 180px;
    h4 {
        padding: unset;
        margin: unset;
        margin-bottom: calc(var(--app-padding) / 3);
    }
    .mg-t {
        margin-top: calc(var(--app-padding) * 3);
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
