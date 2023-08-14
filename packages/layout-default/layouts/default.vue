<template>
    <div id="pageContainer" :class="{isMobile}" >
        <div id="fullPage"></div>
        <div ref="sidebarEl" id="sidebarContainer" :class="{opened}">
            <Logo class="logo" :mode="logo"/>
            <Menu :opened="opened" :class="{opened}"/>
            <div  :class="{expand:true, opened}" >
              <div class="menuActions" style="--icon-color: var(--color-grey-500)">
                <Language v-if="mode === 'development'"></Language>
                <!-- <NotificationBadge v-if="feature.notification"/> -->
  <!--              <UserMiniDropdown v-if="feature.userAuth" />-->
                <LogoutButton />
                <ColorSwitch />
                <LanguageSwitch v-if="feature.multiLanguage" />
              </div>
                <InlineSvg :src="opened ? '/icons/menu/closed.svg' : '/icons/menu/expanded.svg'" @click="toggleOpen"/>
                <!-- <DpIcon :name=" opened ? 's-fold' : 's-unfold'" /> -->
            </div>
        </div>
        <div id="topBarContainer">
        <div class="headerLeft">
          <SvgIcon v-if="isMobile" src="/icons/menu.svg" @click="toggleOpen" />
          <PageTitle :title="pageTitle"  :backPath="backPath"/>
          <slot name="headerLeft" />
        </div>
        <div class="expand">
          <SmartSearch v-if="feature.search && showSearch"/>
          <slot name="postHeader" />
        </div>

        <div v-if="isLogin"  class="actions">
          <UploadStructureButton v-if="uploadState.uploadRequestList && uploadState.uploadRequestList.length > 0" @click="handleOpenUpload"></UploadStructureButton>
          <Notification v-if="feature.notification" />

        </div>
      </div>
        <main id="mainContainer">
          <slot />
          <InteractDrawer ref="InteractDrawerRef">
            <UploadStructure></UploadStructure>
          </InteractDrawer>
        </main>
    </div>
</template>

<script lang="ts" setup>
import InlineSvg from 'vue-inline-svg'
import {useLayout} from "~/composables/layout";
import { onClickOutside } from '@vueuse/core'
const props = withDefaults(defineProps<{
    backPath?: string,
    showSearch?: boolean,
    pageTitle?:  string
}>(), {
  showSearch: true
})
const opened = ref(false);
const logo = computed(() =>  opened.value ? 'withName_white' : 'white_logo' )
const { feature, menu } = useAppConfig();
const {isLogin} = useUser()
const { public:{ mode }} = useRuntimeConfig();
const { isMobile } = useLayout();
const { uploadState, uploadRequestList } = useUploadStore()
const sidebarEl = ref();
const { sideSlot } = useLayout()

onClickOutside(sidebarEl, () => {
  if(isMobile && opened.value) {
    opened.value = false
  }
})
const state = reactive({
})
function toggleOpen() {
     opened.value = !opened.value
}

// #region module:
  const InteractDrawerRef = ref()
  function handleOpenUpload() {
    InteractDrawerRef.value.handleSwitch()
  }
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
        height: 100vh;
        transition: transform .2s ease-in-out;
        &.opened{
          transform: translateX(0);
        }
      }
    }
}

#sidebarContainer{
  grid-area: menu;
  display: grid;
  grid-template-rows: 60px 1fr min-content;
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
    --icon-size: 0.8rem;
    --icon-bg-size: 1.4rem;
    --icon-bg-color: var(--color-grey-0000);
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
.menuActions{
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;
  gap: var(--app-padding);
  margin:0 auto;
  margin-bottom: var(--app-padding);
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
