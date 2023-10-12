/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature:'WORKFLOW',
      name:"admin_workflowForm",
      routeName:"workflowForm",
      url:"/workflowForm",
      icon: "/icons/menu/workflowForm.svg",
      order:9,
      parentId: "admin_workflow",
    }
  ],
})


