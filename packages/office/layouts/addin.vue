<script setup lang="ts">

const props = withDefaults(defineProps<{
  backPath?: string,
  pageTitle?: string
}>(), {
  showSearch: true
})
const logo = 'white_logo'
const { feature, menu } = useAppConfig();
const {isLogin} = useUser()

useHead({
  script:[
    {
      src:"https://appsforoffice.microsoft.com/lib/1/hosted/office.js",
    }
  ]
})
</script>

<template>
  <div id="pageContainer" >
    <div id="fullPage"></div>
    <div id="topBarContainer">
      <div class="headerLeft">
        <Logo class="logo" :mode="logo"/>
        <PageTitle :title="pageTitle"  :backPath="backPath"/>
        <slot name="headerLeft" />
      </div>
      <div class="expand">
        <slot name="postHeader" />
      </div>

      <div v-if="isLogin"  class="actions">
        <!-- <NotificationBadge v-if="feature.notification"/> -->
        <UserMiniDropdown v-if="feature.userAuth" />
      </div>
    </div>
    <main id="mainContainer">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
#pageContainer {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-areas: "header "
                        "content ";
  grid-template-columns: 1fr;
  grid-template-rows: min-content 1fr;
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
  .logo {
    height: 40px;
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

#fullPage{
  position: fixed;
  left: 0;
  top: 0;
}
</style>
