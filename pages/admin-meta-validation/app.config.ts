/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature: 'CORE',
      name:"admin_meta-validation",
      routeName:"meta-validation",
      url:"/meta-validation",
      icon: "/icons/menu/meta.svg",
      order:49,
      parentId: "admin_browse"
    }
  ],
})


