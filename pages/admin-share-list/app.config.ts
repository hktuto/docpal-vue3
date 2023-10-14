/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature:'SHARE_MANAGE',
      name:"admin_share",
      routeName:"shareList",
      url:"/shareList",
      icon: "/icons/menu/share.svg",
      order:5,
      parentId: "admin_shareManage"
    }
  ],
})


