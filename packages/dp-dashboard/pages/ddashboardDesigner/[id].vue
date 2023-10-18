<template>
<NuxtLayout class="fit-height withPadding" backPath="/ddashboardDesigner" :pageTitle="`${$t('admin_dashboard')}/${$t('common_preview')}`">
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
                        Dropdown List<el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="size">size</el-dropdown-item>
                            <el-dropdown-item command="count">count</el-dropdown-item>
                            <el-dropdown-item command="trend">trend</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-button class="el-icon--right" type="primary" 
                    :loading="state.saveLoading"
                    @click="handleSave">{{$t('common_save')}}</el-button>
            </div>
        </div>
        <div class="template-main-container">
            <DashboardDetail ref="DashboardDetailRef" :layout="state.layout"
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
const route = useRoute()
const state = reactive({
    info: {
        name: ''
    },
    layout: [],
    loading: false,
    saveLoading: false
})

async function getInfo() {
    state.info = await GetDashboardApi(route.params.id)
    if(state.info.styleJson) state.layout = JSON.parse(state.info.styleJson)
}
function getData() {
    
}
const DashboardDialogRef = ref()
function handleEdit() {
    DashboardDialogRef.value.handleOpen(state.info)
}
function handleAdd(command) {
    let component = ''
    let setting = {} 
    switch (command) {
        case 'size':
            component = 'DocSizeStatistics'
            setting = {
                style: 'pie',
                displayList: [
                    { documentType: 'File' },
                    { documentType: 'Photo' }
                ]
            }
            break;
        case 'count':
            component = 'DocTypePercentage'
            break;
        case 'trend':
            component = 'DocAddOrientation'
            break;
        default:
            break;
    }
    state.layout.push({
        x: (state.layout.length * 2) % 12,
        y: state.layout.length +  12, // puts it at the bottom
        w: 3,
        h: 6,
        i: new Date().valueOf(),
        component,
        setting
    })
}
function handleDelete(i) {
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
function handleRefresh (layoutSetting) {
    const index = state.layout.findIndex((item) =>  item.i === layoutSetting.i)
    state.layout[index] = deepCopy(layoutSetting)
}

onMounted(async () => {
    getInfo()
    getData()
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
