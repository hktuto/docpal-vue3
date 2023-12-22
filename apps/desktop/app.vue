<template>
    <AuthApp >
      <template #loadingHeader>
        <div data-tauri-drag-region class="headerContainer">
          <TauriHeader  />
        </div>
      </template>
    </AuthApp>
</template>

<script setup>
import { enable, isEnabled, disable } from "tauri-plugin-autostart-api";
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import {useEventListener} from '@vueuse/core';

// listen to scheme-request-received
useEventListener('tauri-scheme-request-received', (event) => {
  console.log(event)
})
onMounted(async()=> {
  // const isAutostartEnabled = await isEnabled();
  // console.log("isAutostartEnabled", isAutostartEnabled)
  // await disable()
  // if (!isAutostartEnabled) {
  //   // prompt window to enable autostart
  //   const canAutostart = confirm("Enable autostart?");
  //   if (canAutostart) {
  //     await enable();
  //   }
  //   // await enable();
  // }
  // let permissionGranted = await isPermissionGranted();
  // if (!permissionGranted) {
  //   const permission = await requestPermission();
  //   permissionGranted = permission === 'granted';
  // }
  // if (permissionGranted) {
  //   sendNotification('Tauri is awesome!');
  //   sendNotification({ title: 'TAURI', body: 'Tauri is awesome!' });
  // }
})
</script>

<style scoped>
.headerContainer{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  //background-color: #f0f0f0;
  z-index: 99;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
}
</style>

