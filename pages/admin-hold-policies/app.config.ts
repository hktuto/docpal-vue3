/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature: 'HOLD_POLICIES',
      name:"admin_holdPoliciesManage",
      routeName:"holdPoliciesManage",
      url:"/holdPoliciesManage",
      icon: "/icons/menu/holdPoliciesManage.svg",
      order:86,
      parentId: 'admin_policy'
    }
  ],
})


