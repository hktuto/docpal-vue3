/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      name:"admin_docker_log",
      routeName:"dockerLog",
      url:"/dockerLog",
      icon: "/icons/menu/dockerLog.svg",
      order:99,
      parentId: "admin_system",
      parentIcon: "/icons/menu/system.svg",
      parentOrder: 10086
    }
  ],
})


