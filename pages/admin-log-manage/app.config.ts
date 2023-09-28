/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      name:"admin_logManage",
      routeName:"logManage",
      url:"/logManage",
      icon: "/icons/menu/log.svg",
      order:69,
      parentId: "admin_system"
    }
  ],
})


