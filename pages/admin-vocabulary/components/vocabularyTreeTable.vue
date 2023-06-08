<template>
    <TreeTableForm ref="TreeTableFormRef" :columns="tableSetting.columns" :table-data="state.tableData"
        :treeTableFormRule="state.rules"
        @deleteRow="(row) => emits('delete-row', row)">
         <template #id="{row}">
            <el-input v-model="row.id" :disabled="row.exist"/>
        </template>
        <template #obsolete="{row}">
            <el-checkbox v-model="row.obsolete"></el-checkbox>
        </template>
    </TreeTableForm>
</template>
<script lang="ts" setup>
import { GetVocabularyApi, TABLE, defaultTableSetting } from 'dp-api'
const props = defineProps<{
    vocabulary: object,
}>()
const emits = defineEmits([
    'delete-row'
])
const TreeTableFormRef = ref()
const tableKey = TABLE.ADMIN_VOCABULARY_TREE_FORM
const tableSetting = defaultTableSetting[tableKey]
const state = reactive({
    rules: {
        'id': [
            { required: true, message: $i18n.t('form_common_requird')}
        ],
        'label': [
            { required: true, message: $i18n.t('form_common_requird')}
        ]
    },
    tableData: [],
    parentList: []
})
function tableDataTreeGet (list) {
    const result = []
    try {
        const keyNodes = {}
        const nodeList = list.map(node => {
            const clone = { ...node, children: [], exist: true }
            if (!clone.parentEntryID) clone.parentEntryID = ''
            keyNodes[clone.id] = clone;
            return clone;
        })
        nodeList.forEach(node => {
            const parent = keyNodes[node.parentEntryID];
            if (parent) parent.children.push(node)
            else result.push(node)
        })
    } catch (error) {
    }
    return result
}
watch(() => props.vocabulary, (newValue) => {
    if(!!newValue && newValue.vocabularyEntries) {
        newValue.vocabularyEntries.forEach(item => {
            state.tableData = tableDataTreeGet(newValue.vocabularyEntries)
        })
    }
    setTimeout(() => {
        TreeTableFormRef.value.initTable(state.tableData)
    })
}, { immediate: true })

defineExpose({ TreeTableFormRef })
</script>
<style lang="scss" scoped>
</style>
