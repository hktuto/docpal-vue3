/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      name:"admin_User",
      routeName:"user",
      url:"/user",
      icon: "/icons/menu/userManage.svg",
      order:4,
    },
    {
      name:"user_groups",
      routeName:"group",
      url:"/group",
      icon: "/icons/menu/group.svg",
      order:4,
    }
  ],
})


