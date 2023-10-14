/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature:'DAM_FILE_CONVERTION',
      name:"admin_DAM",
      routeName:"dam",
      url:"/dam",
      icon: "/icons/menu/dam.svg",
      order:99,
      parentId: "admin_browse",
      parentIcon: "/icons/menu/browser.svg"
    }
  ],
})


