<template>
    <div id="pageContainer" :class="{isMobile}" :style="`--mouse-x:${x}px; --mouse-y:${y}px;`">
        <div id="fullPage"></div>
        <div id="sidebarContainer">
            <Logo class="logo" :mode="logo"/>
            <Menu :opened="opened" :class="{opened}"/>
            <div v-if="menu.length > 0" :class="{expand:true, opened}" @click="toggleOpen">
                <InlineSvg :src="opened ? '/icons/menu/closed.svg' : '/icons/menu/expanded.svg'" />
                <!-- <DpIcon :name=" opened ? 's-fold' : 's-unfold'" /> -->
            </div>
        </div>
        <div id="topBarContainer">
        <div class="headerLeft">
          <PageTitle  :backPath="backPath"/>
          <slot name="headerLeft" />
        </div>
        <div class="expand">
          <SmartSearch v-if="feature.search && showSearch"/>
          <slot name="postHeader" />
        </div>

        <div v-if="isLogin"  class="actions">
          <UploadStructureButton v-if="uploadState.uploadRequestList && uploadState.uploadRequestList.length > 0" @click="handleOpenUpload"></UploadStructureButton>
          <Language v-if="mode === 'development'"></Language>
          <!-- <NotificationBadge v-if="feature.notification"/> -->
          <Notification v-if="feature.notification"/>
          <ColorSwitch />
          <LanguageSwitch v-if="feature.multiLanguage" />
          <UserMiniDropdown v-if="feature.userAuth" />
        </div>
      </div>
        <main id="mainContainer">
          <slot />
          <InteractDrawer ref="InteractDrawerRef">
            <UploadStructure v-if="state.drawerOpen"></UploadStructure>
          </InteractDrawer>
        </main>
    </div>
</template>

<script lang="ts" setup>
import InlineSvg from 'vue-inline-svg'
const props = withDefaults(defineProps<{
    backPath?: string,
    showSearch?: boolean,
}>(), {
  showSearch: true
})
const opened = ref(false);
const logo = computed(() =>  opened.value ? 'withName_white' : 'white_logo' )
const { feature, menu } = useAppConfig();
const {isLogin} = useUser()
const { public:{ mode }} = useRuntimeConfig();
const { isMobile } = useDevice();
const { uploadState, uploadRequestList } = useUploadStore()
const state = reactive({
  drawerOpen: false
})
function toggleOpen() {
     opened.value = !opened.value
}

// #region module: 
  const InteractDrawerRef = ref()
  function handleOpenUpload() {
    state.drawerOpen = !state.drawerOpen
    InteractDrawerRef.value.handleSwitch()
  }
// #endregion
// #region get mouse position
import { useMouse } from '@vueuse/core'
import {useResponsive} from "~/composables/responsive";
const { x, y } = useMouse()
// #endregion

</script>

<style lang="scss" scoped>
#pageContainer{
  background-color: aquamarine;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-areas: "menu header"
                          "menu content";
    grid-template-columns: min-content 1fr;
    grid-template-rows: min-content 1fr;
    &.isMobile{
      grid-template-areas: "header "
                            "content ";
      grid-template-columns: 1fr;
      grid-template-rows: min-content 1fr;

      #sidebarContainer{
        position: absolute;
        transform: translateX(-100vw);
        width: 100vw;
        height: 100vh;
      }
    }
}

#sidebarContainer{
  grid-area: menu;
  display: grid;
  grid-template-rows: 60px 1fr 30px;
  grid-template-areas: "logo"
                        "menu"
                        "toggle";
  background: var(--sidebar-bg);
  transition: all 0.3s ease-in-out;
  color: var(--sidebar-color);
  position: relative;
  isolation: isolate;
  overflow: hidden;
  transform: scale(1);
  box-shadow: 2px 0px 10px rgb(0 0 0 / 30%);
  z-index: 5;

  .logo{
    height: 30px;
    grid-area: logo;
    transition: all 0.2s ease-in-out;
    margin: var(--app-padding);
  }
  .expand {
    margin-inline: var(--app-padding);
  }
  .menu{
    grid-area: menu;
  }
  .expand{
    grid-area: toggle;
    color: #fff;
  }
  &.opened {

    .logo{
      margin-left : 0px;
      width: 100%;
    }
  }
}

#topBarContainer{
  background: var(--header-bg);
  min-height: 40px;
  grid-area: header;
  display: grid;
  grid-template-columns: min-content 1fr min-content;
  padding: calc(var(--app-padding) * 1) calc(var(--app-padding) * 2 );
  gap: var(--app-padding);
  align-items: center;
  position: relative ; // some browser default position is static, will ignore z-index;
  z-index: 4;
  .headerLeft{
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    gap: var(--app-padding);
  }
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

#mainContainer{
  background: var(--el-bg-color);
  overflow: hidden;
  grid-area: content;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr min-content;
}



.fit-height {
  #mainContainer{
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  &.withPadding #mainContainer {
    padding: calc(var(--app-padding) * 2);
  }
}

#fullPage{
  position: fixed;
  left: 0;
  top: 0;
}

</style>
