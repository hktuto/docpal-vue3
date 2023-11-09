<template>
    <div ref="cardRef" class="co-count co-count-chart">
        <div id="myEcharts" ref="chartRef" class="echart"></div>
    </div>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import { GetWorkflowSpendTimeApi } from 'dp-api'
import { useEventListener } from '@vueuse/core'
const props = withDefaults( defineProps<{
    workflow?: string,
    user?: string
}>() , {
    workflow: '',
    user: ''
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
            title: {
                text: $t('dashboard.WorkflowTimeSpendPerWorkflow'),
                left: "left",
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
            type: 'pie',
            label: {
                normal: {
                    position: 'inside', // 在内部显示，outseide 是在外部显示
                    show: true,
                    formatter: '{d}%'
                }
            }
        }
    }
}
const state = reactive({
    data: [],
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
        options.series = {
            ...setting.defaultSetting.series,
            data: state.data
        }

        initChart()
    }
    async function getData(workflow: string) {
        try {
            const initData  = await GetWorkflowSpendTimeApi({ workflowId: workflow, timeGroup: [3,7,14], userId: props.user })
            state.data = Object.keys(initData).reduce((prev,key) => {
                prev.push({ 
                    name: key,
                    value: initData[key]
                })
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
