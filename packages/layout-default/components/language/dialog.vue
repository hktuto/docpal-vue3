<template>
<el-dialog v-model="state.visible" class="" :title="$t('languageSet')"
    :close-on-click-modal="false" draggable :modal="false" append-to-body
    >
    <el-input v-model="filter" placeholder="Search"></el-input>
    <div class="table-container" v-loading="state.loading">
        <Table :columns="tableSetting.columns" :table-data="filterTable"
                v-loading="state.loading"
                @command="handleAction"
                @row-dblclick="handleDblclick">
                <template #enUS="{row}">
                    <el-input v-if="!!row" v-model="row['en-US']"> </el-input>
                </template>
                <template #zhCN="{row}">
                    <el-input v-if="!!row" v-model="row['zh-CN']"> </el-input>
                </template>
                <template #zhHK="{row}">
                    <el-input v-if="!!row" v-model="row['zh-HK']"> </el-input>
                </template>
                <template #actions="{row}">
                    <el-button v-if="!!row" type="primary" :loading="row.loading" @click="handleSubmit(row)">{{$t('submit')}}</el-button>
                </template>
        </Table>
    </div>
</el-dialog>
</template>
<script lang="ts" setup>
import { } from 'dp-api'
import { TABLE, defaultTableSetting } from 'dp-api'
const {
    getLanguageKeys,
    getLanguageListStore,
    getLanguageList,
    setLanguageStores } = useLanguage()
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false,
    visible: false,
    languageKeys: [],
    tableData: [],
})
const filter = ref('');
const filterTable = computed(() => {
    if(!filter.value) return state.tableData
    return state.tableData.filter(item => {
        return item['en-US'].includes(filter.value) || item['zh-CN'].includes(filter.value) || item['zh-HK'].includes(filter.value) || item.key.includes(filter.value)
    })
})
const tableKey = TABLE.PUBLIC_LANGUAGE_SET
const tableSetting = defaultTableSetting[tableKey]
function handleAction () {}
function handleDblclick () {}
async function handleOpen () {
    state.visible = true
    state.languageKeys = getLanguageKeys()
    state.tableData = await getLanguageList(state.languageKeys)
    console.log(state.tableData)
}
async function handleSubmit (row) {
    row.loading = true
    try {
        await setLanguageStores(row)
    } catch (error) {

    }
    row.loading = false
}
onMounted(async() => {
    const data = await getLanguageListStore()
})
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>
.table-container {
    height: 50vh;
    overflow: hidden;
    margin-top: var(--app-padding);
}
</style>
