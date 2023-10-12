/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature:'FOLDER_CABINET',
      name:"admin_folderCabinet",
      routeName:"folderCabinet",
      url:"/folderCabinet",
      icon: "/icons/menu/folderCabinet.svg",
      order:29,
      parentId: "admin_browse"
    }
  ],
})


