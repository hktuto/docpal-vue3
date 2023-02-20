<template>
    <div class="menu">
        <div 
            v-for="item in displayMenu" 
            :key="item.name" 
            :class="{
                menu__item: true,
                selected: $route.fullPath.includes(item.url),
                icon:!opened,
                opened
            }"
            @click="$router.push({ path: item.url })"
            >
            <InlineSvg  :src="item.icon"/>
            <div v-if="opened" class="itemLabel">
                {{ $t(item.name) }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import InlineSvg from 'vue-inline-svg';

const props = withDefaults(defineProps<{
    opened: boolean
}>(),{
    opened: false
})

//#region Set Menu
const { menu } = useAppConfig();
const {user} = useUser();
/**
 * filter Menu to difference role
 */
const displayMenu = computed(
    () => menu.filter( m => m.role ? m.role.includes(user.value.role) : true)
)
//#endregion


</script>



<style lang="scss" scoped>
.menu {
  // border-right: 1px solid var(--color-grey-150);
  white-space: nowrap;
  &__section {
    margin-bottom: calc(var(--app-padding) / 2);
    padding: 0;
    display:flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
  }
  &__item{
    text-decoration: none;
    font-size: 1rem;
    font-weight: 500;
    color: var(--menu-color);
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    padding: calc(var(--app-padding) / 2) var(--app-padding);
    background: transparent;
    border-radius: 6px;
    margin-bottom: 6px;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    svg{
      transition: all 0.2s ease-in-out;
      width:16px;
      margin-right: 6px;
    }
    &.icon{
      svg{
         margin-right: 0px;
      }
    }
    &:hover {
      color: #fff;
      // background: var(--menu-selected-bg);
    }
    &.selected {
      background: var(--menu-selected-bg);
      color: var(--menu-selected-color);
      font-weight: 700;
      box-shadow: 0 2px 6px rgb(0 0 0 / 20%);
    }
  }
}

</style>