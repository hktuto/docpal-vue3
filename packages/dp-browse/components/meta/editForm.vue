<template>
    <div>
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
    </div>
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import {  metaValidationRuleGetApi } from 'dp-api'
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    metaList: []
})
// #region module: set
    async function initMeta (documentType: string, initData: any) {
        if(!documentType) {
            state.metaList = []
            return
        }
        state.metaList = await metaListGet(documentType, initData)
    }
    async function metaListGet(documentType: string, initData: any) {
        const ignoreList = ['dc:title']
        if (!initData) initData = {}
        const res = await metaValidationRuleGetApi(documentType)
        if(!res) return []
        res.forEach(item => {
            if (ignoreList.includes(item.metaData)) return
            else if (item.directoryEntries) {
                item.directoryEntries = handleChildOptions(item.directoryEntries)
                item.value = initData[item.metaData] ? initData[item.metaData] : []
            }
            else item.value = initData[item.metaData] ? initData[item.metaData] : ''
        })
        return res
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
    function validateForm (metaList) {
        let msg = ''
        if (!metaList) return
        metaList.forEach(metaItem => {
            if (!metaItem.display) return
            if (metaItem.isRequire){
                if(metaItem.value instanceof Array) {
                    if(metaItem.value.length === 0) {
                        msg += `[${metaItem.metaData}]: ${$i18n.t('common_canNotEmpty')}<br/>`
                    }
                }else if(!metaItem.value) {
                    msg += `[${metaItem.metaData}]: ${$i18n.t('common_canNotEmpty')}<br/>`
                }
            } 
        })
    
        if (msg.length > 0) {
            ElMessageBox.confirm(msg, $i18n.t('dpTip_warning'), {
                dangerouslyUseHTMLString: true,
                confirmButtonText: $i18n.t('dpButtom_confirm'),
            })
        }
        return msg === ''
    }
// #endregion
defineExpose({ initMeta, getData })
</script>
<style lang="scss" scoped>
.row-item {
    &-top {
        padding: var(--app-padding) 0;
    }
}
</style>
