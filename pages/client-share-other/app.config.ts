/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature:'SHARE_INTERNAL',
      name:"file_share_other",
      routeName:"shareOther",
      url:"/shareOther",
      icon: "/icons/menu/shareOther.svg",
      order:88,
      parentId: 'file_share_module',
      parentIcon: '/icons/menu/share.svg',
      parentOrder: 10086
    }
  ],
})


