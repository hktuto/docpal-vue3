/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature:'MAIL_CONFIG',
      name:"admin_mailConfig",
      routeName:"mailConfig",
      url:"/mailConfig",
      icon: "/icons/menu/mailConfig.svg",
      order: 89,
      parentId: "admin_system"
    }
  ],
})


