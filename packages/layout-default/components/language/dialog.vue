<template>
<el-dialog v-model="state.visible" class="" :title="$t('languageSet')"
    :close-on-click-modal="false" draggable :modal="false"
    >
    <div class="table-container" v-loading="state.loading">
        <Table :columns="tableSetting.columns" :table-data="state.tableData"
                v-loading="state.loading"
                @command="handleAction"
                @row-dblclick="handleDblclick">
                <template #enUS="{row}">
                    <el-input v-model="row['en-US']"> </el-input>
                </template>
                <template #zhCN="{row}">
                    <el-input v-model="row['zh-CN']"> </el-input>
                </template>
                <template #zhHK="{row}">
                    <el-input v-model="row['zh-HK']"> </el-input>
                </template>
                <template #actions="{row}">
                    <el-button type="primary" :loading="row.loading" @click="handleSubmit(row)">{{$t('submit')}}</el-button>
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
const tableKey = TABLE.PUBLIC_LANGUAGE_SET
const tableSetting = defaultTableSetting[tableKey]
function handleAction () {}
function handleDblclick () {}
function handleOpen () {
    state.visible = true
    state.languageKeys = getLanguageKeys()
    state.tableData = getLanguageList(state.languageKeys)
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
}
</style>
