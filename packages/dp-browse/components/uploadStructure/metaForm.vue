<template>
<div v-if="state.doc!.name">
    <div class="flex-x-between">
        <h2>{{state.doc.name}}</h2>
        <el-button type="primary"
            @click="handleApplyToSelected">{{$t('Apply to Selected')}}</el-button>
    </div>
    <main>
        <div class="row-item">
            <div class="row-item-top">
                <span class="color__danger">*</span>
                    {{$t('dpDocument_fileType')}}
            </div>
            <el-select v-model="state.doc.documentType" filterable default-first-option
                @change="handleDocTypeChange(state.doc)">
                <el-option v-for="item in state.fileTypes" :key="item.name" :value="item.name" :label="item.name"></el-option>
            </el-select>
        </div>
        <div v-for="(item, index) in state.doc.metaList" :key="item.metaData+index" class="row-item">
            <template v-if="item.display">
                <div class="row-item-top">
                    <span class="color__danger" v-if="item.isRequire">*</span>
                    {{$t(item.metaData)}}
                </div>
                <template v-if="item.dataType === 'date'">
                    <el-date-picker v-model="item.value"
                            type="datetime"
                            :placeholder="$t('dpTip_datePicker')"
                            :default-time="defaultTime"
                            value-format="YYYY-MM-DDTHH:mm:ss.000Z"
                            class="row-item-bottom-left"
                            style="width: 100%"></el-date-picker>
                </template>
                <template v-else-if="!!item.directoryEntries">
                    <el-cascader v-model="item.value"
                            :options="item.directoryEntries"
                            :props="{ checkStrictly: item.hasChild, value: 'id', label: 'id' }"
                            clearable filterable popper-class="pc-cascader"
                            class="row-item-bottom-left"
                            style="width: 100%"></el-cascader>
                </template>
                <template v-else>
                    <el-input  class="row-item-bottom-left" type="text" v-model="item.value"
                        :maxlength="item.length" show-word-limit/>
                </template>
            </template>
        </div>
    </main>
</div>
<div v-else class="flex-center">
    {{$t('Click document to setting')}}
</div>
</template>


<script lang="ts" setup>
import { ElMessage, ElNotification } from 'element-plus'
import { metaValidationRuleGetApi, getDocTypeListApi } from 'dp-api'
const props = withDefaults(defineProps<{
    checkList: any,
}>(), {
    checkList: []
})
const state = reactive({
    doc: {
        metaList: []
    },
    fileTypes: []
})
const emit = defineEmits(['apply-to-selected'])
function handleApplyToSelected() {
    emit('apply-to-selected', {
        documentType: state.doc.documentType,
        metaList: deepCopy(state.doc.metaList),
        isFolder: state.doc.isFolder
    })
}
async function handleDocTypeChange (doc) {
    const metaList =  await metaListGet(doc.documentType)
    doc.metaList = deepCopy(metaList)
}

// #region module: 初始化
    async function init(doc: any) {
        state.doc = doc
        if(!state.doc.metaList) {
            const metaList =  await metaListGet(doc.documentType)
            state.doc.metaList = structuredClone(metaList)
        }
        getDocType(state.doc.isFolder)
    }
    async function metaListGet(documentType: string) {
        const ignoreList = ['dc:title', 'dc:creator', 'dc:modified', 'dc:lastContributor', 'dc:created', 'dc:publisher', 'dc:contributors', 'common:icon', 'common:icon-expanded', 'uid:uid', 'uid:major_version', 'uid:minor_version', 'file:content', 'files:files', 'nxtag:tags', 'relatedtext:relatedtextresources', 'sec:clearanceLevel', 'sec:securityKeyword']
        const res = await metaValidationRuleGetApi(documentType)
        if(!res) return []
        return res.reduce((prev, item) => {
            if (ignoreList.includes(item.metaData)) {
                return prev
            }
            else if (item.directoryEntries) {
                item.directoryEntries = handleChildOptions(item.directoryEntries)
                item.value = []
            }
            else item.value = ''
            prev.push(item)
            return prev
        }, [])
        function handleChildOptions (list = []) {
            const result = []
            const keyNodes = {}

            const nodeList = list.map(node => {
                const clone = { ...node }
                keyNodes[clone.id] = clone;
                return clone;
            })
            nodeList.forEach(node => {
                const parentItem = keyNodes[node.properties.parent];
                if (parentItem) {
                parentItem.hasChild = true
                if (!parentItem.children) parentItem.children = []
                parentItem.children.push(node)
                }
                else result.push(node)
            })
            return result
        }
    }
    async function getDocType(isFolder) {
        const res = await getDocTypeListApi()
        state.fileTypes = res.filter((item) => item.isFolder === isFolder)
    }
// #endregion
defineExpose({
    init
})
</script>

<style lang="scss" scoped>
h2 {
    margin: unset;
}
.flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.row-item {
    display: grid;
    grid-template-columns: 1fr min-content;
    grid-template-rows: min-content min-content;
    grid-column-gap: var(--app-padding);
    &-top {
        padding: var(--app-padding) 0;
        grid-area: 1 / 1 / 2 / 3;
    }
    &-bottom-left { grid-area: 2 / 1 / 3 / 2; }
    &-bottom-right {
        grid-area: 2 / 2 / 3 / 3;
        min-width: 1px;
    }
}
</style>
