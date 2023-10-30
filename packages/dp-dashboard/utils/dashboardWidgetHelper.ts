export type DashboardWidget = "DocTypeCoCount" | "DocTypeCount" | "DocSizeStatistics" 


export type DashboardWidgetSetting = {
    x?: number
    y ?: number
    i?: string;
    minW: number;
    minH: number;
    maxW: number;
    maxH: number;
    w: number;
    h: number;
    component: string,
    setting: any;
}

export const dashboardWidgetSetting: { [key in DashboardWidget] : DashboardWidgetSetting } = {
    DocSizeStatistics:{
        minW: 1,
        minH: 1,
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
        h: 2,
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
        maxW: 4,
        maxH: 6,
        w: 4,
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
    return dashboardWidgetSetting[widget]
}