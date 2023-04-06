<template>
    <el-dialog v-model="dialogVisible" :title="$t('preview')" class="scroll-dialog">
        <Table v-if="refreshFlag"
                :columns="tableColumn"
                :table-data="tableData">
                <template v-for="item in slots" v-slot:[item]>
                        slot_{{item}}
                </template>
        </Table>
    </el-dialog>
</template>

<script lang="ts" setup>
import { toRefs } from "@vueuse/core"

const state = reactive({
    tableColumn: [],
    tableData: [],
    slots: [],
    refreshFlag: true
})
const dialogVisible = ref(false)
function handleOpen(cols) {
    state.tableData = []
    state.slots = []
    state.refreshFlag = false
    dialogVisible.value = true
    state.tableColumn = deepCopy(cols)
    for (var i = 0; i < 10; i++ ) {
        const tableItem = cols.reduce((prev,item) => {
            if(!item.prop) return prev
            if(item.slot) state.slots.push(item.slot)
            if(item.formatList) item.formatList.forEach(formatItem => {
                prev = createDataByProp(prev, formatItem.prop, formatItem.formatFun)
            })
            // TODO 依据后端数据类型生成数据
            prev = createDataByProp(prev, item.prop)
            return prev
        }, {})
        function createDataByProp (prev:any, prop: string, formatFun?: string) {
            let _pointer = prev
            const props = prop.split('.')
            props.forEach((p,pIndex) => {
                if(pIndex === props.length - 1) {
                    if (!_pointer[p]) {
                        let value = p + (i+1)
                        if (formatFun === 'dateFormat') value = new Date(2000, 1, 1, 23, i%60 + 1, 59)
                        _pointer[p] = value 
                    }
                } else {
                    if (!_pointer[p]) _pointer[p] = {}
                    _pointer = _pointer[p]
                }
            })
            return prev
        }
        state.tableData.push(tableItem)
    }
    setTimeout(() => {
        state.refreshFlag = true
    })
}
const { tableColumn, tableData, refreshFlag, slots } = toRefs(state)
defineExpose({ handleOpen })
</script>

<style scoped lang="scss">
</style>
