<template>
  <div ref="responsiveRef"
   class="responsive-container" v-element-size="onResize">
     <div class="flex-x-start">
        <el-input v-if="inputKey" v-model="state.inputValue" :placeholder="$t(inputPlaceHolder)"
            clearable @input="handleChange"></el-input>
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
                <el-button text>{{$t('button.more')}}
                    <el-tag v-if="state.moreSelected > 0" class="el-icon--right" effect="dark" round size="small">{{state.moreSelected > 9 ? '9+' : state.moreSelected}}</el-tag>
                    <el-icon class="el-icon--right"><ArrowDownBold /></el-icon>
                </el-button>
            </template>
        </el-popover>
        <el-button v-show="state.selected > 0" style="margin: unset" text @click="handleFilter">{{$t('button.clearFilter')}}</el-button>
     </div>
  </div>
</template>

<script  lang="ts" setup>
import { ArrowDownBold } from '@element-plus/icons-vue'
import { vElementSize } from '@vueuse/components'
import { deepCopy } from 'dp-api'

const props = withDefaults(defineProps<{
    inputKey: string,
    inputPlaceHolder: string
}>(), {
  inputPlaceHolder: 'tip.filterByName'
})
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
    isMultiple?: boolean
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
    selected: 0,
    moreSelected: 0,
    padding: 15,
    inputValue: '',
    interval: null
})
// #region module: onResize
    function onResize({ width, height }: { width: number; height: number }) {
        let defaultWidth = state.moreList.length > 0 ? 83 : 0
        const clearFilterStr = $t('clearFilter')
        defaultWidth += clearFilterStr.getWidth() + state.padding * 2
        state.moreList = []
        
        Object.keys(boxRefs.value).reduce((prev, key) => {
            if (!prev) prev = defaultWidth
            const _boxRef = boxRefs.value[key]
            if(!_boxRef) return
            const index = state.list.findIndex(m => m.label === key)
            if(index === -1) return
            const item = state.list[index]
            const boxWidth = getWidth(item)
            prev += boxWidth
            
            if(prev > width) {
                _boxRef.style.display = 'none'
                state.moreList.push(item)
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
            span.style.position = "absolute";
            span.style.top = "0";
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
        if (selectData.value && selectData.value.length > 0 ) {
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
const responsiveRef = ref()
function init(list: ResSelectData[]) {
    state.list = list.reduce((prev, item) => {
        if(item.isMultiple !== false) item.isMultiple = true
        item.value = []
        prev.push(item)
        return prev
    }, [])
    nextTick(() => {
        if(!responsiveRef.value) return
        onResize({ width: responsiveRef.value.offsetWidth, height: 0 })
    })
}
function handleChange (filedData: {fieldName: string, value: any}) {
    if(state.interval) clearInterval(state.interval)
    state.interval = setInterval(() => {
        state.moreSelected = 0
        state.selected = 0
        const formModel = state.list.reduce((prev,item) => {
            if(item.belong) {
                if(!prev[item.belong]) prev[item.belong] = {}
                prev[item.belong][item.key] = item.isMultiple ? item.value : item.value.join(',')
                state.selected ++
            }
            else if(item.value && item.value.length > 0){
                prev[item.key] = item.isMultiple ? item.value : item.value.join(',')
                state.selected ++
            }
            if(state.moreList.find(m => m.key === item.key)) {
                state.moreSelected += item.value.length
            }
            return prev
        }, {})
        if(props.inputKey) formModel[props.inputKey] = state.inputValue
        
        emits('form-change', deepCopy(formModel), filedData)
        clearInterval(state.interval)
        if(responsiveRef.value) return
        onResize({ width: responsiveRef.value.offsetWidth, height: 0 })
    }, 200)
}
function handleFilter () {
    state.inputValue = ''
    state.list.forEach(item => {
        item.value = []
    })
    state.selected = 0
    state.moreSelected = 0
    emits('clear-filter')
    emits('form-change', {}, null )
}
defineExpose({ init })
</script>
<style lang="scss" scoped>
.responsive-container {
    overflow: hidden;
    width: 100%;
    display: flex;
    align-items: flex-end;
    &>div {
        width: 100%;
    }
}
</style>

