/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature:'JOB_STATUS',
      name:"admin_message_queue",
      routeName:"messageQueue",
      url:"/messageQueue",
      icon: "/icons/menu/dockerLog.svg",
      order:79,
      parentId: "admin_system"
    }
  ],
})


