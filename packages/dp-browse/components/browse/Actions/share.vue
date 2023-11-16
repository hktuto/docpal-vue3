<template>
    <div class="flex-x-center">
        <SvgIcon id="shareToQueue" src="/icons/file/share.svg" round></SvgIcon>
        <BrowseActionsButton id="shareActionButton" :label="$t('tip.addToShare')"  >
            <el-badge :value="shareState.shareList.length" :max="99" 
                :hidden="shareState.shareList.length === 0" type="success">
                <SvgIcon src="/icons/file/share.svg" round :content="$t('tip.addToShare')"
                    @click="iconClickHandler"></SvgIcon>
            </el-badge>

        </BrowseActionsButton>
    </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElNotification } from 'element-plus'
import { getJsonApi } from 'dp-api'
import anime from 'animejs'
const router = useRouter()
const route = useRoute()
const { state:shareState, addToShareList } = useShareStore()
// const shareList = inject('selectList')
const props = defineProps<{
    selectedList: any,
    doc: any,
    hideAfterClick: boolean
}>()
function iconClickHandler(){
    if (!props.doc.isFolder) {
        addToShareList([props.doc])
    }
    else if (props.selectedList.length === 0) {
        ElNotification.warning($i18n.t('dpTip_noSelection'))
        return
    }
    else {
        addToShareList(props.selectedList)
    }

    if(props.hideAfterClick) {
        const ev = new CustomEvent('closeFilePreview')
        document.dispatchEvent(ev);
    }
     nextTick(() => {
        const shareDraggableButton = document.getElementById('share-draggable-button')
        const shareToQueue = document.getElementById('shareToQueue')
        shareToQueue.style.transform = 'none'
        shareToQueue.style.display = 'block'
        if(shareDraggableButton) {
            anime({
                targets: '#shareToQueue',
                translateX: shareDraggableButton.offsetLeft - shareToQueue.offsetLeft,
                translateY: shareDraggableButton.offsetTop - shareToQueue.offsetTop - 60,
                duration: 750,
                easing: 'easeInOutQuad'
            })
        }
        setTimeout(() => {
            shareToQueue.style.display = 'none'
        }, 750)
    })
}
</script>
<style lang="scss" scoped>
#shareToQueue {
    z-index: 100;
    display: none;
}
</style>