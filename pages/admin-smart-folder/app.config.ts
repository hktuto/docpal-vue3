/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature:'SMART_FOLDER',
      name:"admin_smartFolder",
      routeName:"smartFolder",
      url:"/smartFolder",
      icon: "/icons/menu/preSearchConfig.svg",
      order:21,
      parentId: "admin_browse"
    }
  ],
})


