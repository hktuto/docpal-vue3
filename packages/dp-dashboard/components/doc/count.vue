<template>
    <!-- <el-card ref="cardRef" class="dashboard-item-main"> -->
        <!-- <el-button @click="handleDelete"></el-button> -->
        <div ref="cardRef" class="dashboard-item-progress" :style="`--icon-size: ${state.iconSize}`">
            <el-progress type="circle" :percentage="state.percentage" :stroke-width="state.width / 8" :width="state.width" :color="setting.color">
                <SvgIcon :src="setting.icon" @click="openSetting"/>
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
import { useEventListener } from '@vueuse/core'
const props = withDefaults( defineProps<{
    setting?: any;
}>() , {
    setting: {}
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
    const pHeight = cardRef.value.offsetHeight - 80
    const pWidth = cardRef.value.offsetWidth - 15
    state.width = Math.min(pWidth, pHeight)
    state.iconSize = state.width / 3 + 'px'
}
// #region module: setting
    const settingRef = ref()
    function openSetting() {
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
            state.percentage = Math.round(state.data[documentType] / state.data.others * 100) 
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
    initStyle()
})
onUnmounted(() => {
})
watch(() => props.setting, (newSetting) => {
    getData(props.setting.documentType)
}, {
    immediate: true
})
defineExpose({
    resize
})
</script>

<style lang="scss" scoped>
.dashboard-item-progress {
    height: 100%;
    width: 100%;
    display: grid;
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
