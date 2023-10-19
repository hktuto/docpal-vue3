<template>
    <el-card ref="cardRef" class="dashboard-item-main">
        <!-- <el-button @click="handleDelete"></el-button> -->
        <div id="myEcharts" ref="chartRef" class="echart"></div>
        <DocCountSetting ref="settingRef" 
            @delete="handleDelete"
            @refresh="handleRefresh"/>
    </el-card>
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
                text: $t('dashboard.documentSize'),
                left: "left",
            },
            graphic: {
                elements: [{
                    type: "image",
                    z: 3,
                    style: {
                        image: ''
                    },
                    left: 'center',
                    top: '41%'
                }]
            },
            toolbox: {
                show: true,
                showTitle: true, 
                itemSize: 15, 
                feature: {
                    mySetting: {
                        show: true,
                        title: $t('dashboard.setting'),
                        icon: '',
                        onclick: ()=> openSetting()
                    }
                }
            },
            tooltip: {
                trigger: 'item'
            }
        },
        series: {
            type: 'pie',
            radius: ['40%', '70%'],
            itemStyle: {
                borderRadius: 5,
                borderColor: '#fff',
                borderWidth: 1
            },
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
    initData: [],
    data: {
    }
})
const picStore = {
}
let options = {}

// #region module: set
    function initStyle () {
        const pHeight = cardRef.value.$el.offsetHeight
        const pWidth = cardRef.value.$el.offsetWidth
        // 需要扣除 .el-card 的 padding
        chartRef.value.style = `height: ${pHeight - 30 }px; width: ${pWidth - 40}px`
    }
    function getSeries (chartData) {
        const data = Object.keys(chartData).reduce((prev,key) => {
            const value = chartData[key]
            const _sItem = {
                value,
                name: key
            }
            prev.push(_sItem)
            return prev
        },[])
        return {
            data,
            ...setting.defaultSetting.series
        }
    }
// #endregion
async function initChart() {
    if (echartInstance) echartInstance.clear()
    echartInstance = echarts.init(chartRef.value);
    echartInstance.setOption(options);
}
function resize() {
    setTimeout(async() => {
        initStyle()
        await handleInitChart(props.setting)
        echartInstance.resize()
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
    async function handleInitChart(chartSetting) {
        options = { 
            ...setting.defaultSetting.options
        }
        // setting icon
        if(!picStore.setting) picStore.setting = 'image://' + await parseSvg('/icons/setting.svg')
        options.toolbox.feature.mySetting.icon = picStore.setting
        options.graphic.elements[0].style = await getIconStyle(chartSetting.icon)
        // data
        await getData(chartSetting.documentType)
        options.series = getSeries(state.data)
        initChart()
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
    nextTick(async() => {
        initStyle()
        // 随着屏幕大小调节图表
        useEventListener(window, 'resize', resize)
    })
})
watch(() => props.setting, (newSetting) => {
    handleInitChart(newSetting)
}, {
    immediate: true
})
defineExpose({
    resize
})
</script>

<style lang="scss" scoped>

</style>
