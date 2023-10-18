/// <reference path="../../global.d.ts" />

export default defineAppConfig({
    menu:[
        {
            // feature:'dashboard',
            name:"admin_dashboard",
            routeName:"ddashboardDesigner",
            url:"/ddashboardDesigner",
            icon: "/icons/menu/dashboard.svg",
            order: 10001,
            parentId: "admin_dashboardManagement"
        }
    ]
})


