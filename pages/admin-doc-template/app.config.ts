/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      name:"admin_docTemplate",
      routeName:"docTemplate",
      url:"/docTemplate",
      icon: "/icons/menu/docTemplate.svg",
      order:99,
      parentId: "admin_workflow"
    }
  ],
})


