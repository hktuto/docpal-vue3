/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      name:"admin_audit",
      routeName:"audit",
      url:"/audit",
      icon: "/icons/menu/audit.svg",
      order:49,
      parentId: "admin_system",
      parentOrder: 10086
    }
  ],
})


