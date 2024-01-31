/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature:'BULK_IMPORT',
      name:"admin_bulkImportConfig",
      routeName:"bulkImport",
      url:"/bulkImport",
      icon: "/icons/menu/bulkImportConfig.svg",
      order: 47,
      parentId: "admin_workflow"
    }
  ],
})


