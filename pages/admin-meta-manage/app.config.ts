/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature: 'CORE',
      name:"admin_meta",
      routeName:"meta",
      url:"/meta",
      icon: "/icons/menu/meta.svg",
      order:27,
      parentId: "admin_browse"
    }
  ],
})


