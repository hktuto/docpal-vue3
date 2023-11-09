<template>
<Draggable v-if="hidden" id="share-draggable-button" class="share-draggable-button" :initialValue="{ x: state.innerWidth / 2 - 100, y: state.innerHeight - 100 }" 
    :handle="handle">
    <div class="flex-x-center">
        <el-icon ref="handle" class="cursor-move"><Rank /></el-icon>
        <el-badge class="el-icon--right" :value="shareState.shareList.length" :max="99" type="success">{{$t('share.shareQueue')}}</el-badge>
        <el-button class="ml-30" type="primary" text @click="handleShare">{{$t('share.share')}}</el-button>
    </div>
  <!-- Drag me! I am at {{x}}, {{y}} -->
</Draggable>
</template>


<script lang="tsx" setup>
import { Rank } from '@element-plus/icons-vue'
import { UseDraggable as Draggable  } from '@vueuse/components'
import { useDraggable } from '@vueuse/core'
const { state:shareState } = useShareStore()
const route = useRoute()
const router = useRouter()
const handle = ref<HTMLElement | null>(null)
const state = reactive<State>({
  innerWidth: window.innerWidth,
  innerHeight: window.innerHeight
})
const hidden = computed(() => {
    return shareState.shareList && 
           shareState.shareList.length > 0 && 
           route.path !== '/browse/share'
})  
function handleShare () {
  // close detail
  const ev = new CustomEvent('closeFilePreview');
  document.dispatchEvent(ev);
  router.push(`/browse/share?backPath=${route.fullPath}`)
}
onMounted(async() => {
})
</script>

<style lang="scss" scoped>
.share-draggable-button {
  position: fixed;
  z-index: 99;
  background-color: #fff;
  border-radius: 36px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
  padding: var(--app-padding);
  .cursor-move {
    cursor: move;
  }
}
.ml-30 {
    margin-left: 30px;
}
</style>
