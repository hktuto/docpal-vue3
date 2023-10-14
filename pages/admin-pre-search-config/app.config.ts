/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature:'SMART_FOLDER',
      name:"admin_smartFolder",
      routeName:"preSearchConfig",
      url:"/preSearchConfig",
      icon: "/icons/menu/preSearchConfig.svg",
      order:1,
      parentId: "admin_browse"
    }
  ],
})


