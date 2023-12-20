<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
function minimize() { appWindow.minimize(); }
function toggleMaximize() { appWindow.toggleMaximize() }
function close() { appWindow.close() }
</script>

<template>
  <div class="titlebar-button" id="titlebar-minimize" @click="minimize">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 12H18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </div>

  <div class="titlebar-button" id="titlebar-maximize" @click="toggleMaximize">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 9V6.5C2 4.01 4.01 2 6.5 2H9" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
      <path d="M15 2H17.5C19.99 2 22 4.01 22 6.5V9" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
      <path d="M22 16V17.5C22 19.99 19.99 22 17.5 22H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
      <path d="M9 22H6.5C4.01 22 2 19.99 2 17.5V15" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
    </svg>
  </div>

  <div class="titlebar-button" id="titlebar-close" @click="close">
    <svg width="18" height="18" viewBox="0 0 24 24" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
         xmlns="http://www.w3.org/2000/svg">
      <g id="close" fill-opacity="1">
        <path d="M0 0L24 0L24 24L0 24L0 0Z" id="close" fill="none" fill-rule="evenodd" stroke="none" />
        <g id="close">
          <path d="M2 22L22 2" id="Vector" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" />
          <path d="M22 22L2 2" id="Vector" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" />
          <path d="M24 0L24 24L0 24L0 0L24 0Z" id="Vector" fill="none" fill-rule="evenodd" stroke="none" />
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.titlebar {
  background-color: rgba(0,0,0,50%);
  height: 40px;
  user-select: none;
  display: flex;
  justify-content: flex-end;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  align-items: center;
  padding-inline: 2px;
}

.titlebar-button {
  display: flex;
  justify-content: center;
  align-items: center;
  fill: white;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  padding: calc(var(--app-padding) / 2 );
  color: var(--color-grey-900);
  &:hover {
    background-color: var(--color-grey-000);
  }
}
#titlebar-close{
  color: red;
}


</style>