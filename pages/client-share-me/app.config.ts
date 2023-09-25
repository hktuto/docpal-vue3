/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      name:"file_share_me",
      routeName:"shareMe",
      url:"/shareMe",
      icon: "/icons/menu/shareMe.svg",
      order:88,
      parentId: 'file_share_module',
    }
  ],
})


