<template>
  <div :style="`--responsive-padding:${state.padding}px`"
   class="responsive-container" v-element-size="onResize">
     <div class="flex-x-start">
        <div v-for="item in state.list" :key="item.label" :ref="el => { boxRefs[item.label] = el }">
            <ResponsiveSelect  :selectData="item" @change="handleChange"/>
        </div>
        <el-popover
            v-if="state.moreList.length > 0"
            placement="bottom"
            :width="200"
            trigger="click"
        >
            <template #default>
                <div v-for="item in state.moreList" :key="item.key">
                    <ResponsiveSelect  :selectData="item" @change="handleChange"/>
                </div>
            </template>
            <template #reference>
                <el-button text>{{$t('more')}}
                    <el-tag v-if="state.moreSelected > 0" class="el-icon--right" effect="dark" round size="small">{{state.moreSelected > 9 ? '9+' : state.moreSelected}}</el-tag>
                    <el-icon class="el-icon--right"><ArrowDownBold /></el-icon>
                </el-button>
            </template>
        </el-popover>
        <el-button text @click="handleFilter">{{$t('clearFilter')}}</el-button>
     </div>
  </div>
</template>

<script  lang="ts" setup>
import { ArrowDownBold } from '@element-plus/icons-vue'
import { vElementSize } from '@vueuse/components'
import { deepCopy } from 'dp-api'
const emits = defineEmits(['form-change', 'clear-filter'])
export type option = {
    label: string,
    value: any,
}
export type ResSelectData = {
    label: string,
    key: string,
    options: option[],
    value?: string[],
}
type state = {
    list: ResSelectData[],
    moreList: ResSelectData[],
    padding: number,
    moreSelected: number
}
const boxRefs = ref({})

const state = reactive<state>({
    list: [],
    moreList: [],
    moreSelected: 0,
    padding: 15
})
// #region module: onResize
    function onResize({ width, height }: { width: number; height: number }) {
        let defaultWidth = state.moreList.length > 0 ? 110 : 0
        const clearFilterStr = $t('clearFilter')
        defaultWidth += clearFilterStr.getWidth() + state.padding * 2
        state.moreList = []
        state.moreSelected = 0
        Object.keys(boxRefs.value).reduce((prev, key) => {
            const _boxRef = boxRefs.value[key]
            const index = state.list.findIndex(m => m.label === key)
            if(index === -1) return
            const item = state.list[index]
            const boxWidth = getWidth(item)
            prev += boxWidth
            if(prev > width) {
                _boxRef.style.display = 'none'
                state.moreList.push(item)
                if (item.value && item.value.length > 0) {
                    state.moreSelected += item.value.length
                }
            } else {
                _boxRef.style.display = 'unset'
                const mIndex = state.moreList.findIndex(m => m.label === key)
                if(mIndex !== -1) state.moreList.splice(mIndex, 1)
            }
            return prev
        }, defaultWidth)
    }
    String.prototype.getWidth = function (fontSize: number = 16) {
        var span = document.getElementById("_getwidthID");
        if (span == null) {
            span = document.createElement("span");
            span.id = "_getwidthID";
            span.style.visibility = "hidden";
            span.style.whiteSpace = "nowrap"
        } else {
            span.style.display = "inline-block"
        }
        document.body.appendChild(span)
        span.innerText = this;
        span.style.fontSize = fontSize + "px";
        const fontWidth = span.offsetWidth;
        return fontWidth;
    }
    function getWidth (selectData: ResSelectData) {
        const labelStr = $t(selectData.label)
        let width = labelStr.getWidth()
        if (selectData.value) {
            const lStr = selectData.value.length > 0 ?
                        selectData.value.length > 9 ?
                        '9+':
                        '9' : 
                        '9'
            width += lStr.getWidth()
            width += 20 // padding+margin
        }
        
        width += 20 // 箭头+margin
        width += state.padding * 2 // padding
        return width
    }
// #endregion
const alist = [
    { 
        key: '1ssssssss', 
        label: '1ssssssss', 
        options: [ 
            { label: 'test1', value: '111'},
            { label: 'test12', value: '1112'},
            { label: 'test13', value: '1113'},
            { label: 'test14', value: '1114'},
            { label: 'test15', value: '11144'},
            { label: 'test16', value: '111444'},
            { label: 'test147', value: '554'},
            { label: 'test148', value: '111554'},
        ], 
        value: []
    },
    {  key: '2ssssssss',   label: '2ssssssss' },
    {  key: '3ssssssss',   label: '3ssssssss' },
    {  key: '4ssssssss',   label: '4ssssssss' },
    {  key: '5ssssssss',   label: '5ssssssss' },
    {  key: '6ssssssss',   label: '6ssssssss' },
    {  key: '7ssssssss',   label: '7ssssssss' },
    {  key: '8ssssssss',   label: '8ssssssss' },
    {  key: '9ssssssss',   label: '9ssssssss' },
]
function init(list: ResSelectData[]) {
    state.list = alist
}
function handleChange (filedData: {fieldName: string, value: any}) {
    const formModel = state.list.reduce((prev,item) => {
        prev[item.key] = item.value
        return prev
    }, {})
    emits('form-change', filedData, deepCopy(formModel) )
}
function handleFilter () {
    state.list.forEach(item => {
        item.value = []
    })
    emits('clear-filter')
    emits('form-change', null, {} )
}
onMounted(() => {
    init()
})
</script>
<style lang="scss" scoped>
.responsive-container {
    overflow: hidden;
    width: 100%;
    &>div {
        width: 100%;
    }
}
.nowrap {
    padding: var(--responsive-padding);
    white-space: nowrap;
}
</style>
