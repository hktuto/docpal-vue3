<template>
<NuxtLayout class="fit-height withPadding" backPath="/data-dashboard" :pageTitle="`${$t('admin_dashboard')}/${$t('common_preview')}`">
    <div class="template-container">
        <div class="flex-x-between">
            <div class="flex-x-between">
                <span class="template-title"> {{ state.info.name }} </span>
                <SvgIcon src="/icons/file/edit.svg" class="el-icon--right"
                    round :content="$t('tip.editTemplateInfo')"
                    @click="handleEdit"></SvgIcon> 
            </div>
            <div>
                <el-dropdown @command="handleAdd">
                    <el-button type="primary">
                        {{$t('common_add')}}
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="DocSizeStatistics">{{$t('dashboard.docTypeSizeChart')}}</el-dropdown-item>
                            <el-dropdown-item command="DocTypeCount">{{$t('dashboard.docTypeCountChart')}}</el-dropdown-item>
                            <el-dropdown-item command="DocTypeCoCount">{{$t('dashboard.docTypeChart')}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
              
                <el-button class="el-icon--right" type="primary" 
                    :loading="state.saveLoading"
                    @click="handleSave">{{$t('common_save')}}</el-button>
            </div>
        </div>
        <div class="template-main-container">
            <!-- <div style="height: 200px; width: 300px;background-color: red;">

                <DocCount :setting="{
                    documentType: 'File',
                    color: 'red',
                    icon: '/icons/eye.svg'}"></DocCount>
            </div> -->
            <DashboardDetail 
                ref="DashboardDetailRef" 
                v-model:layout="state.layout"
                :resizable="true"
                :draggable="true"
                @delete="handleDelete"
                @refreshSetting="handleRefresh"></DashboardDetail>
        </div>
    </div>
    <DashboardDialog ref="DashboardDialogRef" @refresh="getInfo()"/>
</NuxtLayout>
</template>

<script lang="ts" setup> 
import { ElNotification } from 'element-plus'
import { GetDashboardApi, UpdateDashboardApi, QueryDocumentTypeSizeApi, QueryDocumentTypeCountApi, deepCopy } from 'dp-api'
import {
  DashboardWidget,
  DashboardWidgetSetting,
  dashboardWidgetSetting, getNormalizeSetting,
  getWidgetSetting
} from "~/utils/dashboardWidgetHelper";
const route = useRoute()
const state = reactive({
    info: {
        name: ''
    } as any,
    layout: [] as DashboardWidgetSetting[],
    loading: false,
    saveLoading: false
})

const displayLayout = computed(() => {
    return state.layout.map(item => {
        return {
            x :item.x,
            y : item.y,
            w : item.w,
            h : item.h,
        }
    })
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
const DashboardDialogRef = ref()
function handleEdit() {
    DashboardDialogRef.value.handleOpen(state.info)
}
function handleAdd(command:DashboardWidget) {
    console.log(command)
    const item = getWidgetSetting(command)
    console.log("Item", item)
    state.layout.push({
        x: (state.layout.length * 2) % 4,
        y: state.layout.length +  4, // puts it at the bottom
        i: new Date().valueOf().toString(),
        ...item
    })
}
function handleDelete(i:string) {
    const index = state.layout.findIndex((item) =>  item.i === i)
    state.layout.splice(index, 1)
}
async function handleSave() {
    state.saveLoading = true
    try {
        await UpdateDashboardApi({
            ...state.info,
            styleJson: JSON.stringify(state.layout)
        })
    } catch (error) {
    }
    state.saveLoading = false
}
function handleRefresh (layoutSetting:any) {
    const index = state.layout.findIndex((item) =>  item.i === layoutSetting.i)
    state.layout[index] = deepCopy(layoutSetting)
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
