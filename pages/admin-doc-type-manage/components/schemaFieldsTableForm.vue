<template>
    <TreeTableForm ref="TreeTableFormRef" :columns="tableSetting.columns" :table-data="state.tableData"
        :treeTableFormRule="state.rules"
        :options="state.options"
        :disabled="!canEdit">
        <template #title>{{$t('fields')}}</template>
        <template #type="{row}">
            <el-select v-model="row.type" :disabled="!canEdit">
                <el-option v-for="(item, index) in state.fieldTypeList"
                     :key="index" :label="item" :value="item" :disabled="item === 'complex'" />
            </el-select>
            <el-popover
                v-if="isComplexType(row.type)"
                placement="top-start"
                :width="200"
                :visible="row.setPopVisible"
            >
                <template #reference>
                    <el-button v-show="isComplexType(row.type)" class="el-icon--right" type='primary' link
                        @click="row.setPopVisible = !row.setPopVisible">{{ $t('menus_setting') }}</el-button>
                </template>
                <template #default>
                    <el-form-item v-if="row.type === 'directory'" 
                        :label="$t('docType_directoryName')"
                        :prop="`${row.dpRowId}.directoryName`"
                        :rules="[{ required: true, message: $t('form_common_requird') }]">
                        <el-select v-model="row.directoryName" allow-create default-first-option filterable>
                            <el-option v-for="(item, index) in state.directoryTypeList" :key="index" :label="item" :value="item" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-else-if="row.type === 'document'" 
                        :prop="`${row.dpRowId}.valueStored`"
                        :rules="[{ required: true, message: $t('form_common_requird') }]">
                        <template #label>
                            {{$t('docType_valueStored')}}
                            <el-tooltip placement="bottom-start" popper-class="tooltip">
                                <template  #content>
                                    <div>{{$t('docType_documentTip')}}<br/>{{$t('docType_documentTip2')}}<br/>{{$t('docType_documentTip3')}}</div>
                                </template>
                                <el-icon class="el-icon--right"><QuestionFilled /></el-icon>
                            </el-tooltip>
                        </template>
                        <el-select 
                            v-model="row.valueStored" allow-create default-first-option filterable>
                            <el-option v-for="(item, index) in state.valueStoredList" :key="index" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-else-if="row.type === 'user/group'" 
                        :label="$t('docType_canContain')"
                        :prop="`${row.dpRowId}.canContain`"
                        :rules="[{ required: true, message: $t('form_common_requird') }]">
                        <el-select
                            v-model="row.canContain" allow-create default-first-option filterable>
                            <el-option v-for="(item, index) in state.canContainList" :key="index" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-button @click="row.setPopVisible = !row.setPopVisible">{{$t('dpButtom_confirm')}}</el-button>
                </template>
            </el-popover>
        </template>
        <template #setting>

        </template>
        <template #multiple="{row}">
            <el-checkbox v-model="row.isMultiValue" :disabled="!canEdit"></el-checkbox>
        </template>
    </TreeTableForm>
</template>
<script lang="ts" setup>
import { QuestionFilled } from '@element-plus/icons-vue'
import { 
    GetFieldTypesListApi, 
    GetVocabularyIdsApi,
    GetValueStoredListApi,
    GetCanContainListApi,
    isComplexType,
    TABLE, defaultTableSetting } from 'dp-api'
const props = defineProps<{
    canEdit: boolean
}>()
const TreeTableFormRef = ref()
const tableKey = TABLE.ADMIN_SCHEMA_FIELDS_FORM
const tableSetting = defaultTableSetting[tableKey]
const state = reactive({
    rules: {
        'id': [
            { required: true, message: $i18n.t('form_common_requird')}
        ],
        'label': [
            { required: true, message: $i18n.t('form_common_requird')}
        ],
        'type': [
            { required: true, message: $i18n.t('form_common_requird')}
        ]
    },
    options: {
        childDeep: 0
    },
    tableData: [],
    fieldTypeList: [],
    directoryTypeList: [],
    valueStoredList: [],
    canContainList: []
})
async function getOptions () {
    try {
        state.fieldTypeList = await GetFieldTypesListApi()
        state.directoryTypeList = await GetVocabularyIdsApi()
        state.valueStoredList = await GetValueStoredListApi()
        state.canContainList = await GetCanContainListApi()
    } catch (error) {
        
    }
}
onMounted(() => {
    getOptions()
})
defineExpose({ TreeTableFormRef })
</script>
<style lang="scss" scoped>
:deep(.column_type .el-form-item__content) {
    display: grid;
    grid-template-columns: 1fr min-content;
}
.setting {
    white-space: nowrap;
}
.el-form-item {
    flex-direction: column;
    :deep(.el-form-item__label) {
        justify-content: flex-start;
        align-items: center;
    }
}

</style>
<style lang="scss">
.tooltip {
    max-width: 30vw;
    max-height: 30vh;
    overflow: auto;
}
</style>
