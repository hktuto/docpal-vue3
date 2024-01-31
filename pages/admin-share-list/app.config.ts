/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature:'SHARE_EXTERNAL',
      name:"admin_share",
      routeName:"shareList",
      url:"/shareList",
      icon: "/icons/menu/share.svg",
      order: 25,
      parentId: "admin_shareManage"
    }
  ],
})


