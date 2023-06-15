<template>
<el-dialog v-model="state.visible" class="scroll-dialog" :title="$t('languageSet')"
    :close-on-click-modal="false"
    >
    <Table :columns="tableSetting.columns" :table-data="state.tableData"
            v-loading="state.loading"
            @command="handleAction"
            @row-dblclick="handleDblclick">
            <template #currentPath="{row}">
                <span v-if="row.currentPath" class="pathButton"  @click="goClientPath(row.currentPath)">{{ row.logicalPath }}</span>
            </template>
    </Table>
    <div v-for="item in state.languageKeys">
        <b>{{item}}</b>： {{$t(item)}}
        <el-button>{{$t('set')}}</el-button>
    </div>
</el-dialog>
</template>
<script lang="ts" setup>
import { } from 'dp-api'
import { TABLE, defaultTableSetting } from 'dp-api'
const { getLanguageKeys, getLanguageListStore, getLanguageList } = useLanguage()
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false,
    visible: false,
    languageKeys: [],
    tableData: []
})
const tableKey = TABLE.PUBLIC_LANGUAGE_SET
const tableSetting = defaultTableSetting[tableKey]
function handleAction () {}
function handleDblclick () {}
function handleOpen () {
    state.visible = true
    state.languageKeys = getLanguageKeys()
    state.tableData = getLanguageList(state.languageKeys)
}
onMounted(async() => {
    const data = await getLanguageListStore()
})
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>
</style>
