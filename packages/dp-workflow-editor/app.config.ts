export default defineAppConfig({
    feature: {
        darkMode: true,
        multiLanguage: true,
        userAuth: false,
        search: false
    },
    menu:[{
        name:"admin_workflowEditor",
        routeName:"workflowEditor",
        url:"/workflowEditor",
        icon: "/icons/menu/workflowEditor.svg",
        order:2,
    }]
})


