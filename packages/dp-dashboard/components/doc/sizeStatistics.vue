<template>
    <el-card ref="cardRef" class="dashboard-item-main">sizeStatistics
        <div id="myEcharts" ref="chartRef" class="echart"></div>
    </el-card>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import { useEventListener } from '@vueuse/core'

type EChartsOption = echarts.EChartsOption;
const chartRef = ref()
const cardRef = ref()
let echartInstance
function initStyle () {
    const pHeight = cardRef.value.$el.offsetHeight
    const pWidth = cardRef.value.$el.offsetWidth
    chartRef.value.style = `height: ${pHeight - 10 }px; width: ${pWidth - 20}px`
}
function initChart() {
    initStyle()
    const options: EChartsOption = {
        title: {
            text: "2021年各月份销售量（单位：件）",
            left: "center",
        },
        xAxis: {
            type: "category",
            data: [
            "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"
            ]
        },
        tooltip: {
            trigger: "axis"
        },
        yAxis: {
            type: "value"
        },
        series: [
            {
                data: [
                    606, 542, 985, 687, 501, 787, 339, 706, 383, 684, 669, 737
                ],
                type: "line",
                smooth: true,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: "top",
                            formatter: "{c}"
                        }
                    }
                }
            }
        ]
    }
    echartInstance = echarts.init(chartRef.value);
    echartInstance.setOption(options);
    // 随着屏幕大小调节图表
    useEventListener(window, 'resize', resize)
    useEventListener(window, 'echarts-resize', resize)
}
function resize() {
    console.log('resizein');
    
    setTimeout(() => {
        initStyle()
        console.log(echartInstance);
        
        echartInstance.resize();
    })
}
onMounted(() => {
    nextTick(() => {
        initChart()
    })
})
defineExpose({
    resize
})
</script>

<style lang="scss" scoped>
</style>
