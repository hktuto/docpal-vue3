/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature:'SHARE_INTERNAL',
      name:"admin_shareInternal",
      routeName:"shareInternal",
      url:"/shareInternal",
      icon: "/icons/menu/shareMe.svg",
      order:88,
      parentId: "admin_shareManage"
    }
  ],
})


