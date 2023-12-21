<template>
  <div >
    
    <AuthApp />
  </div>
</template>

<script setup>
import { enable, isEnabled, disable } from "tauri-plugin-autostart-api";
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
onMounted(async()=> {
  const isAutostartEnabled = await isEnabled();
  console.log("isAutostartEnabled", isAutostartEnabled)
  await disable()
  if (!isAutostartEnabled) {
    // prompt window to enable autostart
    const canAutostart = confirm("Enable autostart?");
    if (canAutostart) {
      await enable();
    }
    // await enable();
  }
  let permissionGranted = await isPermissionGranted();
  console.log("permissionGranted", permissionGranted)
  if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === 'granted';
  }
  if (permissionGranted) {
    sendNotification('Tauri is awesome!');
    sendNotification({ title: 'TAURI', body: 'Tauri is awesome!' });
  }
})
</script>

