/// <reference path="../../global.d.ts" />

export default defineAppConfig({
    menu:[
        {
            feature:'MASTER_TABLE',
            name:"admin_master-table",
            routeName:"master-table",
            url:"/master-table",
            icon: "/icons/menu/masterTable.svg",
            order: 1,
            parentId: "admin_glossary"
        }
    ]
})


