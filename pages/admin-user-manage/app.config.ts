/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature: 'CORE',
      name:"admin_User",
      routeName:"user",
      url:"/user",
      urls: ['/user/detail'],
      icon: "/icons/menu/userManage.svg",
      order:4,
      parentId: "admin_UserAndGroup"
    },
    {
      feature: 'CORE',
      name:"admin_group",
      routeName:"group",
      url:"/group",
      icon: "/icons/menu/group.svg",
      order:4,
      parentId: "admin_UserAndGroup"
    }
  ],
})


