/// <reference path="../../global.d.ts" />

export default defineAppConfig({
    menu:[
        {
            feature:'EMAIL_TEMPLATE',
            name:"admin_emailTemplate",
            routeName:"emailTemplate",
            url:"/emailTemplate",
            icon: "/icons/menu/mailConfig.svg",
            order: 10001,
            parentId: "admin_templateManagement"
        }
    ]
})


