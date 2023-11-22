<template>
    <!-- <el-card ref="cardRef" class="dashboard-item-main"> -->
        <!-- <el-button @click="handleDelete"></el-button> -->
        <div ref="cardRef" class="dashboard-item dashboard-item-progress" :style="`--icon-size: ${state.iconSize}`">
            <el-progress type="circle" :percentage="state.percentage" :stroke-width="state.width / 8" :width="state.width" :color="setting.color">
                <SvgIcon :content="`${state.percentage}%`" :src="setting.icon" @dblclick="openSetting"/>
            </el-progress>
            <div class="dashboard-item-progress-count">{{state.data[setting.documentType]}}</div>
            <div class="dashboard-item-progress-title"
                >{{setting.documentType}}</div>
            <DocCountSetting ref="settingRef" 
                @delete="handleDelete"
                @refresh="handleRefresh"/>
        </div>
    <!-- </el-card> -->
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import { GetDocTypeCountApi } from 'dp-api'
import { useEventListener, watchDebounced } from '@vueuse/core'
const props = withDefaults( defineProps<{
    setting?: any;
    hideSetting?: boolean,
}>() , {
    setting: {},
    hideSetting: false
})

const cardRef = ref()
const emits = defineEmits([
    'refreshSetting', 'delete'
])
const state = reactive({
    initData: [],
    data: {
    },
    percentage: 0,
    width: 126,
    iconSize: '30px'
})
const picStore = {
}
let options = {}

// #region module: set
    
// #endregion

function resize() {
    initStyle()
}
function initStyle () {
    const pHeight = cardRef.value.offsetHeight - 70
    const pWidth = cardRef.value.offsetWidth - 15
    state.width = Math.min(pWidth, pHeight)
    state.iconSize = state.width / 3 + 'px'
}
// #region module: setting
    const settingRef = ref()
    function openSetting() {
        if (props.hideSetting) return
        settingRef.value.handleOpen(props.setting)
    }
    async function getData(documentType: string) {
        try {
            if(!state.initData || state.initData.length === 0) {
                const res = await GetDocTypeCountApi()
                state.initData = res
            }
            let others = 0
            state.data = state.initData.reduce((prev,item) => {
                if(item.key === documentType) {
                    prev[item.key] = item.count
                } else others += item.count
                return prev
            }, {})
            state.data.others = others
            state.percentage = (state.data[documentType] / (state.data.others+state.data[documentType]) * 100).toFixed(2) 
        } catch (error) {
        }
    }
    function handleDelete() {
        emits('delete')
    }
    function handleRefresh(chartSetting) {
        emits('refreshSetting', chartSetting)
    }
// #endregion
// #region module: 
// #endregion
onMounted(async() => {
    nextTick(() => {
        initStyle()
    })
})
onUnmounted(() => {
})
watchDebounced(props.setting, (newSetting) => {
    getData(props.setting.documentType)
},{ debounce: 200, maxWait: 500, immediate: true })
defineExpose({
    resize
})
</script>

<style lang="scss" scoped>
.dashboard-item-progress {
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: grid;
    grid-template-rows: 1fr min-content min-content;
    div {
        justify-self: center;
        align-self: center;
    }
    &-count {
        font-size: 24px;
    }
    &-title {
        color: #373D43;
    }
}
</style>
