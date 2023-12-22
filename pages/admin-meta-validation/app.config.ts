/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature: 'CORE',
      name:"admin_meta",
      routeName:"meta-validation",
      url:"/meta-validation",
      icon: "/icons/menu/meta.svg",
      order:28,
      parentId: "admin_browse"
    }
  ],
})


