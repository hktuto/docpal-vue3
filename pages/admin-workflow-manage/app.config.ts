/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature:'WORKFLOW',
      name:"admin_runningWorkflow",
      routeName:"workflowManage",
      url:"/workflowManage",
      icon: "/icons/menu/workflow.svg",
      order:1,
      parentId: "admin_workflow"
    }
  ],
})


