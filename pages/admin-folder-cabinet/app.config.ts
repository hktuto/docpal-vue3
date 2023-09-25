/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      name:"admin_folderCabinet",
      routeName:"folderCabinet",
      url:"/folderCabinet",
      icon: "/icons/menu/folderCabinet.svg",
      order:2,
      parentId: "admin_browse"
    }
  ],
})


