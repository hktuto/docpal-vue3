<template>
  <div class="appThemeBg">
    <ElButton>asfasfas</ElButton>
    Hello World!
    <select v-model="$colorMode.preference">
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="sepia">Sepia</option>
      </select>
  </div>
</template>

<style >
.appThemeBg{
  width: 100vw;
  height: 100vh;
}
</style>
