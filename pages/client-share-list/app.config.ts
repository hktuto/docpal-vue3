/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature:'SHARE_EXTERNAL',
      name:"file_share",
      routeName:"shareList",
      url:"/shareList",
      icon: "/icons/menu/share.svg",
      order:5,
      parentId: 'file_share_module',
    }
  ],
})


