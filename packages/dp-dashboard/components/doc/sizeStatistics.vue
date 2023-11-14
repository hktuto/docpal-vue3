<template>
    <el-card ref="cardRef" class="dashboard-item dashboard-item-main">
        <div id="myEcharts" ref="chartRef" class="echart"></div>
        <DocSizeStatisticsSetting ref="settingRef" 
            @delete="handleDelete"
            @refresh="handleRefresh"/>
    </el-card>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import { GetDocTypeSizeApi, GetDocTypeSizeTrendApi } from 'dp-api'
import { useEventListener } from '@vueuse/core'
const props = withDefaults( defineProps<{
    setting?: any;
    hideSetting?: boolean,
}>() , {
    setting: {},
    hideSetting: false
})
type EChartsOption = echarts.EChartsOption;
const chartRef = ref()
const cardRef = ref()
let echartInstance
const emits = defineEmits([
    'refreshSetting', 'delete'
])
const setting = {
    volumeSetting: {
        options: {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            },
            yAxis: {
                type: 'value',
                // interval: 1024 ,
                axisLabel: {
                    formatter:function (value, index) {//自定义提示框里提示的内容、样式等，可以打印看item里的值
                        return fileSize(value, ['MB', 'GB', 'TB', 'PB'])
                    }
                },
                splitLine: {
                    show: true
                }
            },
            tooltip: {
                trigger: 'item',
                formatter:function (item) {//自定义提示框里提示的内容、样式等，可以打印看item里的值
                    return `${item.seriesName}: ${fileSize(item.value, ['MB', 'GB', 'TB', 'PB'])}`
                }
            },
            legend: {
                bottom: '5%',
                left: 'center',
                itemWidth: 10,
                itemHeight: 10,
            }
        },
        series: {
            smooth: true,
            type: 'line'
        }
    },
    percentSetting: {
        options: {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            },
            yAxis: {
                type: 'value'
            },
            tooltip: {
                trigger: 'item',
                formatter:function (item) {//自定义提示框里提示的内容、样式等，可以打印看item里的值
                    return `${item.name} <br/>${item.seriesName}  ${item.value.toFixed(2)}`
                }
            },
            legend: {
                bottom: '5%',
                left: 'center',
                itemWidth: 10,
                itemHeight: 10,
            }
        },
        series: {
            smooth: true,
            type: 'line'
        }
    },
    brickSetting: {
        options: {
            xAxis: {
                type: 'value',
                show: false
            },
            yAxis: {
                show: false,
                data: [$t('dashboard.documentSize')]
            },
            tooltip: {
                trigger: 'item',
                formatter:function (item) {//自定义提示框里提示的内容、样式等，可以打印看item里的值
                    return `${item.seriesName}: ${fileSize(item.value)}`
                }
            },
            legend: {
                bottom: '5%',
                left: 'center',
                itemWidth: 10,
                itemHeight: 10,
            }
        },
        series: {
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    position: 'inside', // 在内部显示，outseide 是在外部显示
                    show: true,
                    formatter:  function (item) {//自定义提示框里提示的内容、样式等，可以打印看item里的值
                        return fileSize(item.value)
                    }
                }
            },
            itemStyle: {
                height: 50
            }
        }
    },
    barSetting: {
        options: {
            xAxis: {
                type: 'value',
                axisLabel: {
                    formatter:function (value, index) {//自定义提示框里提示的内容、样式等，可以打印看item里的值
                        return fileSize(value)
                    }
                }
            },
            yAxis: {
                data: [],
                type: 'category',
            },
            tooltip: {
                trigger: 'item',
                formatter:function (item) {//自定义提示框里提示的内容、样式等，可以打印看item里的值
                    return `${item.seriesName}: ${fileSize(item.value)}`
                }
            },
            legend: {
                bottom: '5%',
                left: 'center',
                itemWidth: 10,
                itemHeight: 10,
            }
        },
        series: {
            type: 'bar',
            label: {
                normal: {
                    position: 'inside', // 在内部显示，outseide 是在外部显示
                    show: true,
                    formatter:  function (item, params) {//自定义提示框里提示的内容、样式等，可以打印看item里的值
                        return fileSize(item.value)
                    }
                }
            }
        }
    },
    pieSetting: {
        options: {
            tooltip: {
                trigger: 'item',
                formatter:function (item) {//自定义提示框里提示的内容、样式等，可以打印看item里的值
                    return `${item.name}: ${fileSize(item.value)}`
                }
            },
            legend: {
                itemWidth: 10,
                itemHeight: 10,
                bottom: '5%',
                left: 'center',
                type: 'scroll',
            },
            title: [
                {
                    text: 143,
                    subtext: $t('dashboard.totalStorage'),
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        fontWeight: 'bolder',
                        color: '#373D43',
                    },
                    subtextStyle: {
                        fontWeight: 'bold',
                        color: '#8796A4',
                    },
                },
                {
                    text: $t('dashboard.totalStorage'),
                    x: 'left',
                    y: 'top',
                }
            ]
        },
        series: {
            type: 'pie',
            radius: ['40%', '70%'],
            itemStyle: {
                // borderRadius: 5,
                // borderColor: '#fff',
                // borderWidth: 1
            },
            label: {
                normal: {
                    position: 'inside', // 在内部显示，outseide 是在外部显示
                    show: true,
                    formatter: '{d}%'
                }
            }
        }
    },
    defaultSetting: {
        options: {
            title: {
                text: $t('dashboard.documentSize'),
                left: "left",
            },
            
        },
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
    }
}
const state = reactive({
    initData: [],
    initTrendData: [],
    data: {
    },
    trendSizeData: {
        test: '4156456'
    },
    trendPercentData: {
    },
    trendXAxis: [],

    width: 100,
    totalStorage: 0
})
const picStore = {
}
let options = {}

// #region module: set
    function initStyle () {
        const pHeight = cardRef.value.$el.offsetHeight -30
        const pWidth = cardRef.value.$el.offsetWidth - 40
        state.width = Math.min(pWidth, pHeight)  
        // 需要扣除 .el-card 的 padding
        chartRef.value.style = `height: ${pHeight }px; width: ${pWidth}px`
    }
    async function setMySettingIcon() {
        
    }
    function getXAxis(chartData) {
        const x = Object.keys(chartData).reduce((prev,item) => {
            prev.push(item)
            return prev
        },[])
        options.xAxis.data = x
    }
    function getSeries (chartData, type: string = 'pie', displayList: any[]) {
        const data = Object.keys(chartData).reduce((prev,key) => {
            const value = chartData[key]
            const _sItem = {
                value,
                name: key
            }
            const dItem = displayList.find(item => item.documentType === key)
            if(!!dItem && !!dItem.color) {
                _sItem.itemStyle = {
                    normal: {
                        color: dItem.color
                    }
                }
            } 
            prev.push(_sItem)
            return prev
        },[])
        return {
            data,
            ...setting[`${type}Setting`].series
        }
    }
    function getTrendSeries (chartData, type: string = 'pie', displayList: any[]) {
        return Object.keys(chartData).reduce((prev,key) => {
            const values = chartData[key]
            const _sItem = {
                ...setting[`${type}Setting`].series,
                name: key,
                data: values instanceof Array ? values : [values]
            }
            if(!displayList) displayList = []
            const dItem = displayList.find(item => item.documentType === key)
            if(!!dItem && !!dItem.color) {
                if(!_sItem.itemStyle) _sItem.itemStyle = {}
                else _sItem.itemStyle = deepCopy(_sItem.itemStyle) // 处理所有数据同一itemStyle问题
                if(!_sItem.itemStyle.normal) _sItem.itemStyle.normal = {}
                _sItem.itemStyle.normal.color = dItem.color
            }
            prev.push(_sItem)
            return prev
        },[])
    }
// #endregion
async function initChart() {
    if (echartInstance) echartInstance.clear()
    echartInstance = echarts.init(chartRef.value);
    echartInstance.setOption(options);
}
function resize() {
    setTimeout(() => {
        initStyle()
        if (props.setting.style === 'pie') {
            options.title[0].textStyle.fontSize =Math.max(state.width / 32 , 14)
            options.title[0].subtextStyle.fontSize =Math.max(state.width / 42 , 12)
            initChart()
            echartInstance.resize();
        }
        else if(echartInstance) echartInstance.resize();
    })
}
// #region module: setting
    const settingRef = ref()
    function openSetting() {
        settingRef.value.handleOpen(props.setting)
    }
    async function handleInitChart(chartSetting) {
        const chartType = chartSetting?.style || 'pie' 
        const displayList = chartSetting?.displayList || []
        options = { 
            ...setting.defaultSetting.options, 
            ...setting[`${chartType}Setting`].options 
        }
        if(!props.hideSetting) {
            if(!picStore.setting) picStore.setting = 'image://' + await parseSvg('/icons/setting.svg')
            setting.toolbox.feature.mySetting.icon = picStore.setting
            options.toolbox = setting.toolbox
        }
        switch(chartType) {
            case 'pie':
                await getData(displayList)
                options.series = getSeries(state.data, chartType, displayList)
                options.title[0].text = fileSize(state.totalStorage)
                options.title[0].textStyle.fontSize = Math.max(state.width / 32 , 14)
                options.title[0].subtextStyle.fontSize =Math.max(state.width / 42 , 10)
                options.title[0].subtext = $t('dashboard.totalStorage')
                options.title[1].text = $t('dashboard.documentSize')
                
                break
            case 'bar':
                await getData(displayList)
                options.series = getTrendSeries(state.data, chartType, displayList)
                options.title.text = $t('dashboard.documentSize')
                console.log({options})
                break
            case 'brick':
                await getData(displayList)
                options.series = getTrendSeries(state.data, chartType, displayList)
                options.title.text = $t('dashboard.documentSize')
                break
            case 'percent':
                await getTrendData(displayList, 'trendPercentData')
                options.series = getTrendSeries(state.trendPercentData, chartType, displayList)
                options.xAxis.data = state.trendXAxis
                options.title.text = $t('dashboard.documentPercent')
                break
            case 'volume':
                await getTrendData(displayList)
                options.series = getTrendSeries(state.trendSizeData, chartType, displayList)
                options.xAxis.data = state.trendXAxis
                options.title.text = $t('dashboard.documentSize')
                break
        }
        initChart()
    }
    async function getData(displayList: any = []) {
        if(!displayList || displayList.length === 0) return {}
        try {
            if(!state.initData || state.initData.length === 0) {
                const res = await GetDocTypeSizeApi()
                state.initData = res
            }
            state.data = {}
            let others = 0
            state.totalStorage = 0
            state.data = state.initData.reduce((prev,item) => {
                const index = displayList.findIndex((i) => i.documentType === item.key)
                if(index === -1) others += item.count
                else prev[item.key] = item.count
                state.totalStorage += item.count
                return prev
            }, {})
            state.data.others = others
        } catch (error) {
        }
    }
    async function getTrendData(displayList, dataType: string = 'trendSizeData') {
        if(!displayList || displayList.length === 0) return {}
        try {
            if(!state.initTrendData || state.initTrendData.length === 0) {
                const res = await GetDocTypeSizeTrendApi()
                state.initTrendData = res?.group_document_type?.buckets || []
            }
            let trendData
            let monthTotal = {}
            let others = []
            state.trendXAxis = []
            trendData = state.initTrendData.reduce((initPrev,initItem, initIndex) => {
                const index = displayList.findIndex((i) => i.documentType === initItem.key)
                if(index === -1) {
                    initItem.group_by_time.buckets.reduce((prev, bucketsItem, index) => {
                        if(!others[index]) others[index] = 0
                        if(!monthTotal[index]) monthTotal[index] = 0
                        others[index] += bucketsItem.cumulative_sum_mb.value
                        if(initIndex === 0) {
                            state.trendXAxis.push(bucketsItem.key_as_string)
                        }
                        monthTotal[index] += bucketsItem.cumulative_sum_mb.value
                    }, [])
                }
                else {
                    const t = initItem.group_by_time.buckets.reduce((prev, bucketsItem, index) => {
                        prev.push(bucketsItem.cumulative_sum_mb.value)
                        if(initIndex === 0) {
                            state.trendXAxis.push(bucketsItem.key_as_string)
                        }
                        if(!monthTotal[index]) monthTotal[index] = 0
                        monthTotal[index] += bucketsItem.cumulative_sum_mb.value
                        return prev
                    }, [])
                    initPrev[initItem.key] = t
                }
                return initPrev
            }, {})
            
            trendData.others = others
            if(dataType === 'trendPercentData') {
                state[dataType] = Object.keys(trendData).reduce((prev, key) => {
                    const item = trendData[key]
                    prev[key] = item.reduce((_prev,_item, _index) => {
                        if(monthTotal[_index] === 0) _prev.push(0)
                        else _prev.push( _item / monthTotal[_index])
                        return _prev
                    }, [])
                    return prev
                }, {})
            } else {
                state[dataType] = trendData
            }
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
onUnmounted(() => {
    echartInstance.dispose()
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
