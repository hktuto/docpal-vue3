<template>
  <el-drawer
    v-drawerDrag="{ min, max }"
    v-model="drawerShow"
    direction="rtl"
    :before-close="handleClose"
    append-to-body
    :wrapperClosable="false" :show-close="false" :modal="modal"
    :style="`--pointer-events: ${pointerModal ? 'none': 'auto'}`"
  >
    <template #title>
      <el-button v-if="closeButton" class="button__close" icon="el-icon-arrow-right" circle @click="handleClose"></el-button>
      <slot name="title" />
    </template>
    <slot />
  </el-drawer>
</template>

<script lang="ts" setup>
import { Directive, DirectiveBinding } from 'vue';
  interface drawerProps {
    min?: [Number, String],
    max?: [Number, String],
    closeButton?: Boolean,
    modal?: Boolean,
    pointerModal?: Boolean
  }
  const props = withDefaults(defineProps<drawerProps>(),{
    min: 300,
    closeButton: true,
    modal: true,
    pointerModal: false
  })
  const vDrawerDrag: Directive = {
    // 在绑定元素的 attribute 前
    // 或事件监听器应用前调用
    mounted(el, binding, vnode, oldVnode) {
      const { min: minWidth, max: maxWidth } = binding.value
      const dragDom = el.querySelector('.el-drawer')
      const resizeElL = document.createElement('div')
      const dragButton = document.createElement('div')
      dragDom.appendChild(dragButton)
      dragDom.appendChild(resizeElL)
      resizeElL.setAttribute("class", "resizeElL");
      dragButton.setAttribute("class", "dragButton");

      resizeElL.onmousedown = (e) => {
        const elW = dragDom.clientWidth
        const EloffsetLeft = dragDom.offsetLeft
        const clientX = e.clientX
        document.onmousemove = function(e) {
          e.preventDefault()
          // 左侧鼠标拖拽位置
          if (clientX > EloffsetLeft && clientX < EloffsetLeft + 10) {
            // 往左拖拽
            if (clientX > e.clientX) {
              if (!maxWidth || dragDom.clientWidth <= maxWidth) {
                dragDom.style.width = elW + (clientX - e.clientX) + 'px'
              }
            }
            // 往右拖拽
            if (clientX < e.clientX) {
              if (dragDom.clientWidth >= minWidth) {
                dragDom.style.width = elW - (e.clientX - clientX) + 'px'
              }
            }
          }
        }
        // 拉伸结束
        document.onmouseup = function(e) {
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    }
  }
  const drawerShow = ref(false)
  function handleClose () {
    drawerShow.value = false
  }
  function handleOpen () {
    console.log('handleOpen');
    
    drawerShow.value = true
  }
  defineExpose({ handleOpen, handleClose})
</script>

<style lang="scss" scoped>
.el-drawer__wrapper {
  // z-index: -1!important;
  pointer-events: var(--pointer-events);
  // .el-drawer__container {
  //   pointer-events: var(--pointer-events);
  // }
}
.el-drawer {
  pointer-events: auto;
  border-top-left-radius: calc(var(--app-padding) );
  border-bottom-left-radius: calc(var(--app-padding) );
  &__header {
    & > :first-child {
      flex: unset;
      margin-right: 5px;
    }
    margin-bottom: 10px;
  }
  &__body {
    padding: 0 20px 1rem 20px;
  }
  .grid__drawer__title {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr min-content;
    align-items: center;
  }
}

:deep(.dragButton) {
  width: 6px;
  border-radius: 3px;
  height: 6rem;
  background: var(--color-grey-500);
  // cursor: grab;
  cursor: w-resize;

  position: absolute;
  left: 8px;
  top: 50%;
}
:deep(resizeElL) {
  cursor: w-resize;
  height: 100%;
  width: 14px;

  position: absolute;
  left: 0;
  top: 0;
}
</style>
