/// <reference path="../../global.d.ts" />

export default defineAppConfig({
  menu:[
    {
      feature:'VOCABULARY',
      name:"admin_vocabulary",
      routeName:"vocabulary",
      url:"/vocabulary",
      icon: "/icons/menu/vocabulary.svg",
      order: 1,
      parentId: "admin_glossary"
    }
  ],
})


