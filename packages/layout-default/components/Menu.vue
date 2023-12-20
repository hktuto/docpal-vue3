<template>
    <el-menu
        class="el-menu-vertical"
        :default-active="menuActive"
        :collapse="collapse"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
    >
      <DpMenuItem v-for="item in displayMenu" :menu="item"></DpMenuItem>
    </el-menu>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
    collapse: boolean
}>(),{
    collapse: false
})

//#region Set Menu
const { menu, feature } = useAppConfig();
const appStore = useAppStore();
const {user} = useUser();
const router = useRouter();
const route = useRoute();
const displayMenu = ref([])
const menuActive = computed(() => {
    let _menu = menu.find(item => route.path.includes(item.url))
    return _menu?.name || ''
})
/**
 * filter Menu to difference role
 */
function toTree (data) {
    // 空数组
    const result = []
    if (!Array.isArray(data)) return result // 判断不是数组  直接返回
    data = data.filter((item) => !item.feature || item.feature === 'CORE' || appStore.licenseFeatures[item.feature]) 
    data.forEach(item => {
        delete item.children
    }) // 清空children
    const map = {}
    data.forEach(item => { map[item.id] = JSON.parse(JSON.stringify(item)) })
    data.forEach(item => {
        if(item.role && !item.role.includes(user.value.role)) return
        if(item.condition && !feature[item.condition]) return
        if(item.parentId) {
            const parent = map[item.parentId]
            if (parent) {
                if (!parent.children) parent.children = []
                if (item.parentOrder) parent.order = item.parentOrder
                if (item.parentName) parent.name = item.parentName
                // if (item.parentRouteName) parent.routeName = item.parentRouteName
                if (item.parentIcon) parent.icon = item.parentIcon
                parent.children.push({...item})
            } else {
                map[item.parentId] = {
                    name: item.parentName || item.parentId,
                    // routeName: item.parentRouteName || '',
                    url: item.parentUrl || '',
                    icon: item.parentIcon || item.icon || '',
                    order: item.parentOrder || item.order || 10000,
                    children: []
                } 
                map[item.parentId].children.push({...item})
                result.push(map[item.parentId])
            }
        } else {
            result.push({...item})
        }
    })
    result.forEach(item => {
        if(item.children) item.children = item.children.sort((a,b) => a.order - b.order)
    })
    return result.sort((a,b) => a.order - b.order)
}

function handleOpen(key: string, keyPath: string[]) {
//   console.log('handleOpen', key, keyPath)
}
function handleClose(key: string, keyPath: string[]) {
//   console.log('handleClose', key, keyPath)
}
function handleSelect(key: string, keyPath: string[]) {
  if(!!key){
    const _menu = menu.find(item => item.name === key)
    if(!!_menu) router.push({ path: _menu.url })
  } 
}
onMounted(() => {
    displayMenu.value = toTree(menu)
})
</script>



<style lang="scss" scoped>
.menu-selected {
    --icon-color: var(--menu-selected-color);
    background: var(--menu-selected-bg);
    box-shadow: 0 2px 6px #0003;
    color: var(--menu-selected-color)!important;
    font-weight: 700;
    border-radius: 4px 0 0 4px;
}
.el-menu, :deep(.el-menu)  {
  --icon-size: 1rem;
  --icon-color: var(--menu-color);
  --icon-hover-color: var(--menu-color);
  background-color: unset;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &:not(.el-menu--collapse) {
    width: max-content;
  }
  
}
:deep(.el-menu-item), :deep(.el-sub-menu__title) {
    padding: calc(var(--app-padding)/2) var(--app-padding);
    margin-inline: var(--app-padding) 0;
    margin-bottom: 6px;
    height: unset;
    line-height: unset;
    font-size: 1rem;
    font-weight: 500;
    color: var(--menu-color);
    display: grid;
    grid-template-columns: min-content 1fr min-content;
    gap: var(--app-padding);
    border-radius: 4px 0 0 4px;
    &:hover {
        @extend .menu-selected;
    }
    &.is-active {
        @extend .menu-selected;
    }
}

:deep(.el-sub-menu) {
    &.is-active {
        .el-sub-menu__title {
            @extend .menu-selected;
        }
    }
    &.is-active.is-opened {
        .el-sub-menu__title { 
            @extend .menu-selected;
            opacity: .8;
        }
    }
    .el-menu {
        width: calc(100% - var(--app-padding));
        margin-inline: var(--app-padding) 0;
        .el-menu-item {
            padding-left: calc(var(--app-padding) * 2);
        }
    }
}

:deep(.el-sub-menu__icon-arrow) {
    position: unset;
    top: unset;
    right: unset;
    margin-top: unset;
}
:deep(.el-sub-menu) {
    background: unset;
    box-shadow: unset;
}
.el-menu--collapse {
    :deep(.el-sub-menu) {
        &.is-opened {
            .el-sub-menu__title { 
                @extend .menu-selected;
                opacity: .8;
            }
        }
    }
}
</style>
