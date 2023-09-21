/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      name:"admin_bulkImportConfig",
      routeName:"bulkImport",
      url:"/bulkImport",
      icon: "/icons/menu/bulkImportConfig.svg",
      order:12,
      parentId: "admin_workflow"
    }
  ],
})


