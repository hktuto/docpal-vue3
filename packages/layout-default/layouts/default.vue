<template>
    <div id="pageContainer" :style="`--mouse-x:${x}px; --mouse-y:${y}px;`">
        <div id="sidebarContainer">
            <Logo class="logo" :mode="logo"/>
            <Menu :opened="opened" :class="{opened}"/>
            <div :class="{expand:true, opened}" @click="toggleOpen">
                <InlineSvg :src="opened ? '/icons/menu/closed.svg' : '/icons/menu/expanded.svg'" />
                <!-- <DpIcon :name=" opened ? 's-fold' : 's-unfold'" /> -->
            </div>
        </div>
        <main id="mainContainer">
            <div id="topBarContainer">
                  <PageTitle  :backPath="backPath"/>
                <div class="expand">
                  <SmartSearch />
                  <slot name="postHeader" />
                </div>
                <div class="actions">
                  <ColorSwitch />
                  <LanguageSwitch />
                  <UserMiniDropdown />
                </div>
            </div>
            <div id="mainContent">
                <slot />
            </div>
        </main>
    </div>
</template>

<script lang="ts" setup>
import InlineSvg from 'vue-inline-svg'
const props = defineProps<{
    backPath?: string
}>()
const opened = ref(false);
const logo = computed(() =>  opened.value ? 'withName_white' : 'white_logo' )

function toggleOpen() {
     opened.value = !opened.value
}
// #region get mouse position
import { useMouse } from '@vueuse/core'
const { x, y } = useMouse()
// #endregion

</script>

<style lang="scss" scoped>
#pageContainer{
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-columns: min-content 1fr;
}

#mainContainer{
    background: var(--el-bg-color);
    height: 100%;
    overflow: hidden;
    display: grid;
    grid-template-rows: min-content 1fr;
    z-index: 1;
}
#topBarContainer{
    background: var(--header-bg);
    height: 100%;
    min-height: 40px;
    display: grid;
    grid-template-columns: min-content 1fr min-content;
    padding: calc(var(--app-padding) * 1) calc(var(--app-padding) * 2 );
    gap: var(--app-padding);
    align-items: center;
    z-index: 2;
    .expand{
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      gap: var(--app-padding);
    }
    .actions{
      display: flex;
      flex-flow: row nowrap;
      gap : var(--app-padding);
      justify-content: flex-start;
      align-items: center;
    }
}
#mainContent{
    overflow: hidden;
}


#sidebarContainer {
  // height: 100vh;
  display: grid;
  grid-template-rows: 60px auto 30px;
  grid-template-areas: "logo"
                        "menu"
                        "toggle";
  background: var(--sidebar-bg);
  padding: calc(var(--app-padding) * 1.2);
  transition: all 0.3s ease-in-out;
  color: var(--sidebar-color);
  position: relative;
  isolation: isolate;
  overflow: hidden;
  transform: scale(1);
  box-shadow: 2px 0px 10px rgb(0 0 0 / 30%);
  z-index: 3;
  
  &:after{
    --size: 250px;
    position: fixed;
    left: calc(var(--mouse-x) - var(--size) / 2 );
    top: calc(var(--mouse-y) - var(--size) / 2 );
    content: "";
    background-color: var(--effect-color);
    width: var(--size);
    height: var(--size);
    filter: blur(50px);
    z-index: -1;
    border-radius: 1e5px;
    pointer-events: none;
  }
  // block safari for after effect
  @supports (-webkit-appearance:none){
    &:after{
      content:none;
    }
  }
  .logo{
   height: 30px;
   grid-area: logo;
   transition: all 0.2s ease-in-out;
  }
  .menu{
    grid-area: menu;
  }
  .expand{
    grid-area: toggle;
    color: #fff;
    @media (max-width: 640px) {
      position: absolute;
      bottom: 0;
      right: -56px;
      padding: 8px;
      background-color: var(--primary-color);
      &.opened{
        right: 0px;
      }
    }
  }
  &.opened {
    
    .logo{
      margin-left : 0px;
      width: 100%;
    }
  }
}
.fit-height {
  #mainContent{
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  &.withPadding #mainContent {
    padding: calc(var(--app-padding) * 2);
  }
}
</style>