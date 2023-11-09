export type DashboardWidget = "DocTypeCoCount" | "DocTypeCount" | "DocSizeStatistics"  | "WorkflowCoCount" 
export type WorkflowCoCountWidget = "WorkflowActiveCount" | "WorkflowApproveRate" | "WorkflowNewCount"  | "WorkflowTimeSpendPerTask" | "WorkflowTimeSpendPerWorkflow"  
import DocTypeCoCount from  '../components/doc/coCount/index.vue'
import DocTypeCount from  '../components/doc/count.vue'
import DocSizeStatistics from  '../components/doc/sizeStatistics.vue'
// workflow co-count
import WorkflowCoCount from  '../components/workflow/coCount/index.vue'
import WorkflowActiveCount from  '../components/workflow/coCount/activeCount.vue'
import WorkflowApproveRate from  '../components/workflow/coCount/approveRate.vue'
import WorkflowNewCount from  '../components/workflow/coCount/newCount.vue'
import WorkflowTimeSpendPerTask from  '../components/workflow/coCount/timeSpendPerTask.vue'
import WorkflowTimeSpendPerWorkflow from  '../components/workflow/coCount/timeSpendPerWorkflow.vue'
import  '../assets/dashboard.scss'

export type DashboardWidgetSetting = {
    x?: number,
    y ?: number,
    i?: string,
    minW?: number,
    minH?: number,
    maxW?: number,
    maxH?: number,
    w: number,
    h: number,
    component: any,
    setting?: any,
    show?: boolean,
    layout?: DashboardWidgetSetting
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
            ],
            showUserFilter: true
        }
    },
    WorkflowCoCount:{
        minW: 2,
        minH: 2,
        maxW: 12,
        maxH: undefined,
        w: 6,
        h: 6,
        component : 'WorkflowCoCount',
        setting: {
            workflow: 'contractApproval',
            displayList: [
                'WorkflowNewCount',
                'WorkflowTimeSpendPerTask',
                'WorkflowTimeSpendPerWorkflow',
                'WorkflowActiveCount',
                // 'WorkflowApproveRate',
            ],
            showUserFilter: true
        }
    }
}

export const  getWidgetSetting = (widget: DashboardWidget) => {
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

    'WorkflowCoCount': WorkflowCoCount,
    'WorkflowActiveCount': WorkflowActiveCount,
    'WorkflowApproveRate': WorkflowApproveRate,
    'WorkflowNewCount': WorkflowNewCount,
    'WorkflowTimeSpendPerTask': WorkflowTimeSpendPerTask,
    'WorkflowTimeSpendPerWorkflow': WorkflowTimeSpendPerWorkflow
}