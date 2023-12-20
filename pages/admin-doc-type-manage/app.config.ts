/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature:'DOCUMENT_TYPE',
      name:"admin_docType",
      routeName:"docType",
      url:"/docType",
      icon: "/icons/menu/docType.svg",
      order:25,
      parentId: "admin_browse"
    }
  ],
})


