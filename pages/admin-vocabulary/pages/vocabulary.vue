<template>
<NuxtLayout class="fit-height withPadding">
    <div class="section">
        <div class="list">
            <KeywordFilter :list="state.vocabularyIds" attr="id"
                    @filter="handleUserFilter"></KeywordFilter>
            <div class="list-user">
                <template v-for="item in state._vocabularyIds" >
                    <!-- TODO 自动滚动 -->
                    <div :class="['vocabulary-item','cursorPointer', {'current': state.curVocabulary.id === item.id }]" @click="handleTabClick(item)">
                        <div class="ellipsis" :title="item.id">{{item.id}}</div>
                    </div>
                </template>
            </div>
        </div>
        <div class="topArea" v-if="state.curVocabulary" v-loading="state.loading">
            <div class="flex-x-between">
                <h3>{{state.curVocabulary.id}}({{state.curVocabulary.type}})</h3>
                <el-button @click="handleSubmit">{{$t('dpTool_save')}}</el-button>
            </div>
            <div style="overflow: hidden;">
                <VocabularySimpleTable v-if="state.curVocabulary.type === 'Simple Vocabulary'"
                    ref="VocabularyTableRef" :vocabulary="state.curVocabulary"
                    @delete-row="handleDeleteRow"></VocabularySimpleTable>
                <VocabularyChildTable v-else-if="state.curVocabulary.type === 'Child Vocabulary'"
                    ref="VocabularyTableRef" :vocabulary="state.curVocabulary"
                    @delete-row="handleDeleteRow"></VocabularyChildTable>
                <VocabularyTreeTable v-else
                    ref="VocabularyTableRef" :vocabulary="state.curVocabulary"
                    @delete-row="handleDeleteRow"></VocabularyTreeTable>
            </div>
        </div>
    </div>
</NuxtLayout>
</template>


<script lang="ts" setup>
import { ElNotification, ElMessage } from 'element-plus'
import {
    GetVocabularyIdsApi,
    GetVocabularyApi,
    DeleteVocabularyApi,
    UpdateVocabularyApi,
    AddVocabularyApi
} from 'dp-api'

const router = useRouter()
const route = useRoute()
const state = reactive({
    vocabularyIds: [],
    _vocabularyIds: [],
    curVocabulary: {id: ''},
    loading: false
})
async function handleTabClick (row) {
    router.push({query: { id: row.id }})
    try {
        getVocabularyDetail(row)
    } catch (error) {
        state.curVocabulary = row
    }
}
async function getVocabularyDetail (row) {
    state.loading = true
    try {
        state.curVocabulary = await GetVocabularyApi(row.id)
    } catch (error) {
    }
    state.loading = false
}
const VocabularyTableRef = ref()
async function handleSubmit () {
    let data
    if(state.curVocabulary.type === 'Hierarchical Vocabulary') {
        data = await VocabularyTableRef.value.TreeTableFormRef.getFlatData('id', 'parentEntryID')
    } else {
        data = await VocabularyTableRef.value.TreeTableFormRef.getFormData()
    }
    if (!data) {
        ElMessage.warning(`${$i18n.t('dpMsg_checkData')}`)
        return
    }
    data.forEach(item => {
        if (!item.parentEntryID) item.parentEntryID = ''
    })
    const modifiedData = filterSameData(data, state.curVocabulary.vocabularyEntries)
    if (modifiedData.length === 0) {
        ElMessage.warning(`${$i18n.t('dpMsg_noDataUpdate')}`)
        return
    }
    const pList = []
    modifiedData.forEach(item => {
        if (item.exist) pList.push(UpdateVocabularyApi(state.curVocabulary.id, item))
        else pList.push(AddVocabularyApi(state.curVocabulary.id, item))
    })
    Promise.all(pList).then(async (res) => {
        const successList = []
        const failList = []
        res.forEach((item, index) => {
            if (item.state) successList.push(item.id)
            else failList.push(item.id)

        })
        await getVocabularyDetail({id: state.curVocabulary.id})
        if (successList.length === pList.length) ElMessage.success($i18n.t('dpMsg_success') as string)
        else ElMessage.error( `${failList.join(',')} ${$i18n.t('dpMsg_error')}`)
    })
}
function filterSameData (targetData, existData) {
    const result = targetData.filter((targetItem) => {
        return !existData.some(existItem => existItem.id === targetItem.id
                                            && existItem.label === targetItem.label
                                            && existItem.obsolete === targetItem.obsolete
                                            && existItem.order === targetItem.order
                                            && existItem.parentEntryID === targetItem.parentEntryID)
    })
    return result
}
async function getVocabularyIds(refresh: boolean = false) {
    const res = await GetVocabularyIdsApi(refresh)
    state.vocabularyIds = res.map(item => ({id: item })).sort((a,b)=> (a.id.localeCompare(b.id) ))
    state._vocabularyIds = state.vocabularyIds
    if(state._vocabularyIds.length > 0) {
        const id = route.query.id || state._vocabularyIds[0].id
        handleTabClick({id: id})
    }
}
function handleUserFilter(data) {
    state._vocabularyIds = data
}
// #region module: action
    async function handleDeleteRow (row) {
        state.loading = true
        try {
            if (row.exist) await DeleteVocabularyApi(state.curVocabulary.id, row)
            await getVocabularyDetail({id: state.curVocabulary.id})
        } catch (error) {

        }
        state.loading = false
    }
// #endregion
onMounted(async() => {
    getVocabularyIds()
})
</script>

<style lang="scss" scoped>
.pageContainer{
  height: 100%;
  padding: calc( var(--app-padding) * 2);
  position: relative;
}
.section {
    overflow: hidden;
    height: 100%;
    display: grid;
    grid-template-columns: minmax(min-content, 200px) 1fr;
  padding: calc( var(--app-padding) * 2);
    gap: var(--app-padding);
    .vocabulary-item {
        padding: var(--app-padding);
    }
    .list {
        display: grid;
        grid-template-rows: min-content 1fr;
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
    }
}
</style>
