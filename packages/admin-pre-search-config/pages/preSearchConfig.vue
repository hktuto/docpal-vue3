<template>
<NuxtLayout class="fit-height withPadding">
    <div class="section" >
        <div class="list" v-loading="state.listLoading">
            <KeywordFilter :list="state.preSearchList" attr="name"
                    @filter="handleKeywordFilter"></KeywordFilter>
            <div class="list-user">
                <template v-for="item in state._preSearchList" >
                    <!-- TODO 自动滚动 -->
                    <div :class="['vocabulary-item','cursorPointer', {'current': state.curPreSearch.name === item.name }]" @click="handleTabClick(item)">
                        <div class="ellipsis" :title="item.name">{{item.name}}</div>
                        <el-icon color="#F56C6C"
                                @click.stop="handleDelete(item)"><Delete /></el-icon>
                    </div>
                </template>
            </div>
            <el-button :loading="state.addLoading" @click="openDialog()">{{$t('common_new')}}</el-button>
        </div>
        <div class="topArea" v-if="state.curPreSearch.name" v-loading="state.loading">
            <div class="flex-x-end">
                <el-button type="primary" @click="handleSubmit">{{$t('dpTool_save')}}</el-button>
            </div>
            <FromRenderer ref="FromRendererRef" :form-json="formJson">
                <!-- <template #header>
                    <el-button type="primary" @click="handleSubmit">{{$t('dpTool_save')}}</el-button>
                </template> -->
            </FromRenderer>
        </div>
        <PreSearchConfigAddDialog ref="PreSearchConfigAddDialogRef" @refresh="(routeName) => getPreSearchList(true, routeName)"></PreSearchConfigAddDialog>
    </div>
</NuxtLayout>
</template>


<script lang="ts" setup>
import { ElNotification, ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { 
    GetPreSearchListApi,
    UpdatePreSearchApi,
    DeletePreSearchApi,
    getJsonApi
} from 'dp-api'

const router = useRouter()
const route = useRoute()
const state = reactive({
    preSearchList: [],
    _preSearchList: [],
    curPreSearch: {name: ''},
    loading: false,
    listLoading: false,
    addLoading: false
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin-adminPreSearch.json')
async function handleTabClick (row) {
    router.push({query: { id: row.name }})
    state.curPreSearch = row
    setTimeout(() => {
        FromRendererRef.value.vFormRenderRef.resetForm()
        if (!!row) {
            FromRendererRef.value.vFormRenderRef.setFormData({ ...state.curPreSearch.detail, name: row.name })
        }
    })
}
async function handleSubmit () {
    state.loading = true
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    const param = deepCopy(data)
    state.curPreSearch.name = param.name
    if (!param.paramsInTextSearch) delete param.paramsInTextSearch
    delete param.name
    const res = await UpdatePreSearchApi({ ...state.curPreSearch, json_value: JSON.stringify(param)})
    if (!res.errorCode) {
        router.push({query: { id: state.curPreSearch.name }})
    } else {
        await getPreSearchList(true)
    }
    state.loading = false
}
function handleAdd () {

}
async function getPreSearchList(refresh: boolean = false, routeName: string = '') {
    state.listLoading = true
    const res = await GetPreSearchListApi(refresh)
    state.preSearchList = res.map(item => ({ id: item.id, name: item.name, detail: JSON.parse(item.json_value) })).sort((a,b)=> (a.name.localeCompare(b.name) ))
    state._preSearchList = state.preSearchList
    if(state._preSearchList.length > 0) {
        routeName = routeName ? routeName : route.query.id
        const index = state._preSearchList.findIndex(item => item.name === routeName)
        const item = index !== -1 ? state._preSearchList[index] : state._preSearchList[0]
        handleTabClick(item)
    }
    state.listLoading = false
}
function handleKeywordFilter(data) {
    state._preSearchList = data
}
const PreSearchConfigAddDialogRef = ref() 
function openDialog () {
    PreSearchConfigAddDialogRef.value.handleOpen()
}
function handleDelete(row) {
    ElMessageBox.confirm(`${$i18n.t('msg_confirmWhetherToDelete')}`)
        .then(async() => {
            const res = await DeletePreSearchApi(row.id)
            getPreSearchList()
        })
}
onMounted(async() => {
    getPreSearchList()
})
</script>

<style lang="scss" scoped>
.section {
    overflow: hidden;
    height: 100%;
    display: grid;
    grid-template-columns: minmax(min-content, 200px) 1fr;
    gap: var(--app-padding);
    .vocabulary-item {
        padding: var(--app-padding);
        display: grid;
        gap: var(--app-padding);
        grid-template-columns: 1fr min-content;
    }
    .list {
        display: grid;
        grid-template-rows: min-content 1fr min-content;
        gap: var(--app-padding);
        overflow: hidden;
        height: 100%;
        .list-user {
            width: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            .current {
                background-color: var(--menu-selected-color);
                color: var(--color-grey-050);
            }
        }
    }
    .topArea {
        height: 100%;
        display: grid;
        grid-template-rows: min-content 1fr;
        overflow: hidden;
        .formContainer {
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
        }
    }
}   
</style>