<template>
    <div ref="cardRef" class="co-count co-count-chart">
        <div id="myEcharts" ref="chartRef" class="echart"></div>
    </div>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import { GetWorkflowNewCountTrendApi } from 'dp-api'
import { useEventListener } from '@vueuse/core'
const props = withDefaults( defineProps<{
    workflow?: string,
    user?: string
}>() , {
    user: '',
    workflow: ''
})
type EChartsOption = echarts.EChartsOption;
const chartRef = ref()
const cardRef = ref()
let echartInstance
const emits = defineEmits([
    'refreshSetting', 'delete'
])
const setting = {
    defaultSetting: {
        options: {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            title: {
                text: $t('dashboard.WorkflowNewCount'),
                left: "left",
            },
            yAxis: {
                type: 'value'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                bottom: '5%',
                left: 'center',
                itemWidth: 10,
                itemHeight: 10,
            }
        },
        series: {
            type: 'line',
            smooth: true
        }
    }
}
const state = reactive({
    data: [],
    xAxis: []
})
let options = {}

// #region module: set
    function initStyle () {
        const pHeight = cardRef.value.offsetHeight
        const pWidth = cardRef.value.offsetWidth
        console.log(pHeight,pWidth)
        // 需要扣除 .el-card 的 padding
        chartRef.value.style = `height: ${pHeight}px; width: ${pWidth - 20}px`
    }
// #endregion
async function initChart() {
    initStyle()
    if (echartInstance) echartInstance.clear()
    echartInstance = echarts.init(chartRef.value);
    echartInstance.setOption(options);
}
function resize() {
    setTimeout(async() => {
        initStyle()
        if(!!echartInstance) echartInstance.resize()
    },10)
}
// #region module: setting
    const settingRef = ref()
    function openSetting() {
        settingRef.value.handleOpen(props.setting)
    }
    async function getIconStyle(iconSrc) {
        const style = {
            image: await parseSvg(iconSrc),
            width: chartRef.value.clientWidth / 10,
        }
        return style
    }
    async function handleInitChart(workflow) {
        options = { 
            ...setting.defaultSetting.options
        }
        // data
        await getData(workflow)
        options.xAxis.data = state.xAxis
        options.series = {
            ...setting.defaultSetting.series,
            data: state.data
        }
        initChart()
    }
    async function getData(workflow: string) {
        try {
            const initData = await GetWorkflowNewCountTrendApi({ workflowId: workflow, userId: props.user  })
            state.xAxis = []
            state.data = initData.reduce((prev,item) => {
                prev.push(item.count)
                state.xAxis.push(item.key)
                return prev
            }, [])
        } catch (error) {
        }
    }
// #endregion
// #region module: 
// #endregion
onMounted(async() => {
    nextTick(async() => {
        initStyle()
        // 随着屏幕大小调节图表
        useEventListener(window, 'resize', resize)
    })
})
onUnmounted(() => {
    echartInstance.dispose()
})
watch(() => props, (newValue) => {
    handleInitChart(props.workflow)
}, {
    immediate: true,
    deep: true
})
defineExpose({
    resize
})
</script>

<style lang="scss" scoped>
</style>
