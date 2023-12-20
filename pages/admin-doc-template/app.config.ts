/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    // {
    //   feature:'GENERATE_TEMPLATE',
    //   name:"admin_docTemplate",
    //   routeName:"docTemplate",
    //   url:"/docTemplate",
    //   icon: "/icons/menu/docTemplate.svg",
    //   order:29,
    //   parentId: "admin_workflow"
    // },
    {
      feature:'GENERATE_TEMPLATE',
      name:"admin_template",
      routeName:"template",
      url:"/template",
      icon: "/icons/menu/docTemplate.svg",
      order: 49,
      parentId: "admin_templateManagement"
    }
  ],
})


