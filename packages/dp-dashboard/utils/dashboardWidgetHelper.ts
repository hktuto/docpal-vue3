export type DashboardWidget = "DocTypeCoCount" | "DocTypeCount" | "DocSizeStatistics" 
import DocTypeCoCount from  '../components/doc/coCount/index.vue'
import DocTypeCount from  '../components/doc/count.vue'
import DocSizeStatistics from  '../components/doc/sizeStatistics.vue'

import  '../assets/dashboard.scss'

export type DashboardWidgetSetting = {
    x?: number
    y ?: number
    i?: string;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    w: number;
    h: number;
    component: any,
    setting: any;
}

export const dashboardWidgetSetting: { [key in DashboardWidget] : DashboardWidgetSetting } = {
    DocSizeStatistics:{
        minW: 2,
        minH: 2,
        maxW: 4,
        maxH: 4,
        w: 2,
        h: 2,
        component: "DocSizeStatistics",
        setting : {
            style: 'pie',
            displayList: [
                { documentType: 'File' },
                { documentType: 'Video' }
            ]
        }
    },
    DocTypeCount:{
        minW: 1,
        minH: 2,
        maxW: 2,
        maxH: 4,
        w: 1,
        h: 1,
        component : 'DocTypeCount',
        setting : {
            documentType: 'File',
            color: 'red',
            icon: '/icons/file/info.svg'
        }
    },
    DocTypeCoCount:{
        minW: 2,
        minH: 2,
        maxW: 12,
        maxH: undefined,
        w: 6,
        h: 2,
        component : 'DocTypeCoCount',
        setting : {
            documentType: 'File',
            color: '#fff',
            showCount: true,
            showSize: true,
            displayList: [
                { meta: 'dc:creator' }
            ]
        }
    }
}

export const  getWidgetSetting = (widget: DashboardWidget) => {
    console.log(dashboardWidgetSetting, widget)
    return dashboardWidgetSetting[widget]
}

export const getNormalizeSetting= (setting: DashboardWidget) => {
    const item = getWidgetSetting(setting)
    return {
        minW: item.minW,
        minH: item.minH,
        maxW: item.maxW,
        maxH: item.maxH,
    }
}

export const widgetComponent = {
    'DocTypeCoCount': DocTypeCoCount,
    'DocTypeCount': DocTypeCount,
    'DocSizeStatistics': DocSizeStatistics,
}