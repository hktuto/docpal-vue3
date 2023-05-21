<template>
    <TreeTableForm ref="TreeTableFormRef" :columns="tableSetting.columns" :table-data="state.tableData"
        :treeTableFormRule="state.rules"
        :options="state.options"
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
import { QuestionFilled } from '@element-plus/icons-vue'
import { TABLE, defaultTableSetting } from 'dp-api'
const props = defineProps<{
    vocabulary: object,
}>()
const emits = defineEmits([
    'delete-row'
])
const TreeTableFormRef = ref()
const tableKey = TABLE.ADMIN_VOCABULARY_SIMPLE_FORM
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
    options: {
        childDeep: 0
    },
    tableData: []
})
watch(() => props.vocabulary, (newValue) => {
    state.tableData = []
    if(!!newValue && newValue.vocabularyEntries) {
        newValue.vocabularyEntries.forEach(item => {
            if (!item.parentEntryID) item.parentEntryID = ''
            item.obsolete = Boolean(item.obsolete)
            item.exist = true
            state.tableData.push({ ...item })
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
