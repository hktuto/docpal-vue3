<template>
    <el-card ref="cardRef" class="dashboard-item-main">
        <div id="myEcharts" ref="chartRef" class="echart"></div>
        <DocSizeStatisticsSetting ref="settingRef" 
            @delete="handleDelete"
            @refresh="handleRefresh"/>
    </el-card>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import { deepCopy, GetDocTypeSizeApi, GetDocTypeSizeTrendApi } from 'dp-api'
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
    volumeSetting: {
        options: {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            },
            yAxis: {
                type: 'value'
            },
            legend: {
                bottom: '5%',
                left: 'center'
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
            legend: {
                bottom: '5%',
                left: 'center'
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
                type: 'category'
            },
            legend: {
                bottom: '5%',
                left: 'center'
            }
        },
        series: {
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    position: 'inside', // 在内部显示，outseide 是在外部显示
                    show: true,
                    formatter: '{c}'
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
                type: 'value'
            },
            yAxis: {
                data: [],
                type: 'category',
            },
            legend: {
                bottom: '5%',
                left: 'center'
            }
        },
        series: {
            type: 'bar',
            label: {
                normal: {
                    position: 'inside', // 在内部显示，outseide 是在外部显示
                    show: true,
                    formatter: '{c}'
                }
            }
        }
    },
    pieSetting: {
        options: {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                bottom: '5%',
                left: 'center'
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
    },
    defaultSetting: {
        options: {
            title: {
                text: $t('dashboard.documentSize'),
                left: "left",
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
        },
    }
}
const state = reactive({
    data: {
        Photo: 160,
        File: 340,
        video: 80,
        Invoice: 400,
        others: 120
    },
    trendData: {
        photo: [10,20,50,60,5,15],
        File: [100,200,10,5,3,12],
        video: [10,20,50,5,3,2],
        invoice: [100,100,50,120,10,20],
        others: [10,20,15,15,30,30]
    },
    trendXAxis: []
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
        if(echartInstance) echartInstance.resize();
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
        if(!picStore.setting) picStore.setting = 'image://' + await parseSvg('/icons/setting.svg')
        options.toolbox.feature.mySetting.icon = picStore.setting
        switch(chartType) {
            case 'pie':
                getData()
                options.series = getSeries(state.data, chartType, displayList)
                break
            case 'bar':
                getData()
                options.series = getTrendSeries(state.data, chartType, displayList)
                break
            case 'brick':
                getData()
                options.series = getTrendSeries(state.data, chartType, displayList)
                break
            case 'percent':
                getTrendData()
                options.series = getTrendSeries(state.trendData, chartType, displayList)
                options.xAxis.data = props.trendXAxis
                break
            case 'volume':
                getTrendData()
                options.series = getTrendSeries(state.trendData, chartType, displayList)
                options.xAxis.data = props.trendXAxis
                break
        }
        console.log({options});
        
        initChart()
    }
    async function getData() {
        // return
        try {
            const res = await GetDocTypeSizeApi()
            console.log(res);
            // state.data
        } catch (error) {
        }
    }
    async function getTrendData( ) {
        // return
        try {
            const res = await GetDocTypeSizeTrendApi()
            console.log(res);
            
            //  state.trendData
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
