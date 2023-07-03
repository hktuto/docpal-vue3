export default defineAppConfig({
    menu:[
        {
          name:"file_search",
          routeName:'search',
          url:"/search",
          icon: "/icons/menu/search.svg",
          order:1,
          condition: 'search'
        }
      ],
})

