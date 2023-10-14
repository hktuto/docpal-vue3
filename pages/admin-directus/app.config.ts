/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature: 'DIRECTUS',
      name:"admin_directus",
      routeName:"directus",
      url:"/directus",
      icon: "/icons/menu/dockerLog.svg",
      order:99,
      parentId: "admin_system"
    }
  ],
})


