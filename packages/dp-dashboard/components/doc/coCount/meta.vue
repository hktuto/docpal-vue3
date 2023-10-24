<template>
    <div ref="cardRef" class="co-count-meta">
        <div id="myEcharts" ref="chartRef" class="echart"></div>
    </div>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import { deepCopy, GetCoCountMetaApi } from 'dp-api'
import { useEventListener } from '@vueuse/core'
const emits = defineEmits([
    'drillDown'
])
const props = withDefaults( defineProps<{
    meta?: string;
    documentType?: string;
    user?: string
    data?: any
}>() , {
    meta: '',
    documentType: '',
    user: ''
})
type EChartsOption = echarts.EChartsOption;
const chartRef = ref()
const cardRef = ref()
let echartInstance
const setting = {
    defaultSetting: {
        options: {
            title: {
                text: $t('dashboard.fileSizes'),
                left: "left",
            },
            tooltip: {
                trigger: 'item',
                position: 'right'

            },
            legend: {
                bottom: '5%',
                left: 'center'
            }
        },
        series: {
            type: 'pie',
            label: {
                normal: {
                    position: 'inside', // 在内部显示，outseide 是在外部显示
                    show: true,
                    formatter: '{c}',
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
        // 需要扣除 .el-card 的 padding
        chartRef.value.style = `height: ${pHeight}px; width: ${pWidth - 20}px`
    }
// #endregion
async function initChart() {
    if (!!echartInstance) {
        echartInstance.dispose()
    }
    echartInstance = echarts.init(chartRef.value);
    echartInstance.setOption(options);
    echartInstance.resize()
}
function drillDown(data) {
    emits('drillDown', { meta: props.meta, key: data.key })
}
function resize() {
    setTimeout(async() => {
        initStyle()
        if(!!echartInstance) echartInstance.resize()
    })
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
    async function handleInitChart(data) {
        options = { 
            ...setting.defaultSetting.options
        }
        // data
        await getData(data)
        options.series = {
            name: `Metadata/${props.meta}`,
            ...setting.defaultSetting.series,
            data: deepCopy(state.data)
        }
        options.title.text = `Metadata/${props.meta}`
        initChart()
        echartInstance.on('click', (event) => drillDown(event.data))
    }
    async function getData(data) {
        try {
            state.data = data.buckets.reduce((prev,item) => {
                prev.push({
                    value: item.doc_count,
                    name: item.key_as_string ? formatDate(item.key_as_string, 'YYYY-MM-DD') : item.key,
                    key: item.key
                })
                return prev
            }, [])
        } catch (error) {
            state.data = [
            ]
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
watch(() => props.data, (newData) => {
    handleInitChart(newData)
}, {
    immediate: true,
    deep: true
})
defineExpose({
    resize, handleInitChart
})
</script>

<style lang="scss" scoped>
.co-count-meta {
    width: 100%;
    height: 100%;
    min-height: 500px;
}
</style>
