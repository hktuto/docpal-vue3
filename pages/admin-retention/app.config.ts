/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature: 'CORE',
      name:"admin_retention",
      routeName:"retentionManage",
      url:"/retentionManage",
      icon: "/icons/menu/retention.svg",
      order:86,
      parentId: 'admin_policy'
    }
  ],
})


