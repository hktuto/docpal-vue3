<template>
    <div v-loading="state.loading">
        <template v-if="state.metaList.length > 0">
            <div v-for="(item, index) in state.metaList" :key="item.metaData+index" class="row-item">
                <template v-if="item.display">
                    <div class="row-item-top">
                        <span class="color__danger" v-if="item.isRequire">*</span>
                        {{item.metaData}}
                    </div>
                    <template v-if="item.dataType === 'date'">
                        <el-date-picker v-model="item.value"
                                type="datetime"
                                :placeholder="$t('dpTip_datePicker')"
                                :default-time="defaultTime"
                                value-format="YYYY-MM-DDTHH:mm:ss.000Z"
                                class="row-item-bottom-left"
                                style="width: 100%"
                                @change="handleChange"></el-date-picker>
                    </template>
                    <template v-else-if="!!item.directoryEntries">
                        <el-cascader v-model="item.value"
                                :options="item.directoryEntries"
                                :props="{ checkStrictly: item.hasChild, value: 'id', label: 'id' }"
                                clearable filterable popper-class="pc-cascader"
                                class="row-item-bottom-left"
                                style="width: 100%"
                                @change="handleChange"></el-cascader>
                    </template>
                    <template v-else>
                        <el-input  class="row-item-bottom-left" type="text" v-model="item.value"
                            :maxlength="item.length" show-word-limit
                            @change="handleChange"/>
                    </template>
                </template>
            </div>
        </template>
        <template v-else-if="showNoData">
            {{$t('noData')}}
        </template>
    </div>
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import {  metaValidationRuleGetApi } from 'dp-api'
const props = defineProps<{
    showNoData: boolean
}>();
const emits = defineEmits([
    'refresh', 'meta-change'
])
const state = reactive({
    metaList: [],
    loading: false
})
// #region module: set
    async function initMeta (documentType: string, initData: any) {
        if(!documentType) {
            state.metaList = []
            return
        }
        state.loading = true
        state.metaList = await metaListGet(documentType, initData)
        state.loading = false
        return state.metaList
    }
    async function metaListGet(documentType: string, initData: any) {
        const ignoreList = ['dc:title', 'dc:creator', 'dc:modified', 'dc:lastContributor', 'dc:created', 'dc:publisher', 'dc:contributors', 'common:icon', 'common:icon-expanded', 'uid:uid', 'uid:major_version', 'uid:minor_version', 'file:content', 'files:files', 'nxtag:tags', 'relatedtext:relatedtextresources', 'sec:clearanceLevel', 'sec:securityKeyword']
        if (!initData) initData = {}
        const res = await metaValidationRuleGetApi(documentType)
        if(!res) return []
        const result = res.reduce((prev,item) => {
            if (ignoreList.includes(item.metaData)) return prev
            else if (item.directoryEntries) {
                item.directoryEntries = handleChildOptions(item.directoryEntries)
                item.value = initData[item.metaData] ? initData[item.metaData] : []
            }
            else item.value = initData[item.metaData] ? initData[item.metaData] : ''
            prev.push(item)
            return prev
        }, [])
        return result
    }
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
// #endregion

// #region module: get
    function getData () {
        if (!validateForm(state.metaList)) return false
        return state.metaList.reduce((prev, item) => {
            if (item.value instanceof Array) {
                if(item.value.length > 0) prev[item.metaData] = item.value
            }
            else if(item.value) prev[item.metaData] = item.value
            return prev
        }, {})
    }
    function validateForm (metaList, messageError: boolean = true) {
        const msg = getValidateMsg(metaList)
    
        if (msg.length > 0 && messageError) {
            ElMessageBox.confirm(msg, $i18n.t('dpTip_warning'), {
                dangerouslyUseHTMLString: true,
                confirmButtonText: $i18n.t('dpButtom_confirm'),
            })
        }
        return msg === ''
    }
    function getValidateMsg (metaList, properties?) {
        let msg = ''
        if (!metaList) return msg
        metaList.forEach(metaItem => {
            if (!metaItem.display) return
            if (metaItem.isRequire){
                if(!!properties && (!metaItem.value || metaItem.value.length === 0)) {
                    metaItem.value = properties[metaItem.metaData]
                }
                if(metaItem.value instanceof Array) {
                    if(metaItem.value.length === 0) {
                        msg += `[${metaItem.metaData}]: ${$i18n.t('common_canNotEmpty')}<br/>`
                    }
                }else if(!metaItem.value) {
                    msg += `[${metaItem.metaData}]: ${$i18n.t('common_canNotEmpty')}<br/>`
                }
            } 
        })
        return msg
    }
// #endregion
// #region module: change
    function handleChange () {
        const properties = state.metaList.reduce((prev, item) => {
            if (item.value instanceof Array) {
                if(item.value.length > 0) prev[item.metaData] = item.value
            }
            else if(item.value) prev[item.metaData] = item.value
            return prev
        }, {})
        emits('meta-change', properties)
    }
// #endregion
defineExpose({ initMeta, getData, validateForm, getValidateMsg, metaListGet })
</script>
<style lang="scss" scoped>
.row-item {
    &-top {
        padding: var(--app-padding) 0;
    }
}
</style>
