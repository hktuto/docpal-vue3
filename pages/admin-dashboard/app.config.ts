export default defineAppConfig({
    feature: {
        darkMode: true,
        multiLanguage: true,
        userAuth: true,
        search: false
    },
    menu:[{
        feature:'DASHBOARD',
        name:"admin_dashboard",
        routeName:"data-dashboard",
        url:"/data-dashboard",
        icon: "/icons/menu/dashboard.svg",
        order: 10001,
        parentId: "admin_dashboardManagement"
    }]
})


