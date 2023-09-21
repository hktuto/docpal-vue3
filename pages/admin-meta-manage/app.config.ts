/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      name:"admin_meta",
      routeName:"meta",
      url:"/meta",
      icon: "/icons/menu/meta.svg",
      order:7,
      parentId: "admin_browse"
    }
  ],
})


