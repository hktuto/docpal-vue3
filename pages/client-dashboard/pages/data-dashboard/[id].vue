<template>
<NuxtLayout class="fit-height withPadding" backPath="/data-dashboard" :pageTitle="`${$t('admin_dashboard')}/${$t('common_preview')}`">
    <div class="template-container">
        <div class="flex-x-between">
            <div class="flex-x-between">
                <span class="template-title"> {{ state.info.name }} </span>
            </div>
        </div>
        <div class="template-main-container">
            <DashboardDetail 
                ref="DashboardDetailRef" 
                v-model:layout="state.layout"
                :hideSetting="true"
                :resizable="false"
                :draggable="false"></DashboardDetail>
        </div>
    </div>
</NuxtLayout>
</template>

<script lang="ts" setup> 
import { ElNotification } from 'element-plus'
import { GetDashboardApi } from 'dp-api'
import {
    DashboardWidget,
    DashboardWidgetSetting,
    getNormalizeSetting,
} from "../../../../packages/dp-dashboard/utils/dashboardWidgetHelper";
const route = useRoute()
const state = reactive({
    info: {
        name: ''
    } as any,
    layout: [] as DashboardWidgetSetting[],
    loading: false,
    saveLoading: false
})

async function getInfo() {
    state.info = await GetDashboardApi(route.params.id as string)
    if(!state.info || !state.info.styleJson) return
    const temLayout = JSON.parse(state.info.styleJson);
    if(Array.isArray(temLayout)){
        state.layout = temLayout.map( item => {
            return Object.assign(item, getNormalizeSetting(item.component))
        })
    }
}
onMounted(async () => {
    getInfo()
})
</script>

<style lang="scss" scoped>
.template-container {
    display: grid;
    grid-template-rows: min-content 1fr;
    gap: var(--app-padding);
    overflow: hidden;
}
.template-main-container {
    overflow: auto;
  > div{
    min-width: 1280px;
  }
}
.template-interact-drawer {
    height: 100%;
    overflow: hidden;
    box-shadow: unset;
    border-left: 1px solid #ddd;
    display: grid;
    grid-template-rows: min-content 1fr min-content;
    gap: var(--app-padding);
    padding-bottom: 0;
    .formContainer {
        overflow: auto;
    }
}
.template-title {
    font-size: 18px;
    font-weight: bold;
    line-height: 22px;
    letter-spacing: 0px;
    color: #606266;
}
</style>
