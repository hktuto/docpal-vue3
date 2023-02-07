<template>
    <div id="pageContainer">
        <div id="sidebarContainer">
            <Logo class="sideBarLogo" :mode="logo"/>
            <slot name="sidebar" />
        </div>
        <main id="mainContainer">
            <div id="topBarContainer">
                <slot name="header" />
            </div>
            <div id="mainContent">
                <slot />
            </div>
        </main>
    </div>
</template>

<script lang="ts" setup>
const sidebarOpened = ref(false);
const logo = computed(() =>  sidebarOpened.value ? 'withName_white' : 'white_logo' )
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
#sidebarContainer{
    background: var(--el-color-info-light-7);
    height: 100%;
    min-width: 40px;
}
#mainContainer{
    background: var(--el-color-info-light-9);
    height: 100%;
    overflow: hidden;
    display: grid;
    grid-template-rows: min-content 1fr;
}
#topBarContainer{
    background: var(--el-color-info-light-8);
    height: 100%;
    min-height: 40px;
}
#mainContent{
    overflow: hidden;
}

.sideBarLogo {
  height: 25px;
  width: auto;
  // height: 60px;
  display: grid;
  justify-self: flex-start;
  cursor: pointer;
}
</style>