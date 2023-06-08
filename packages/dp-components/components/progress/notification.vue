<script lang="ts" setup>
import { ElNotification } from 'element-plus'
import Progress from './index.vue'
const props = defineProps<{
    options: progressType
}>()
const state = reactive({
    noticeList: []
})
function handleOpen() {
    const notice = ref({})
    notice.value.id = new Date().valueOf().toString() 
    notice.value.el = ElNotification({
        title: props.title,
        dangerouslyUseHTMLString: true,
        message: h(Progress, {
                onClose: handleClose,
                class: 'test',
                options: props.options,
                noticeId: notice.value.id
            }),
        showClose: true,
        customClass: 'progress-notification',
        duration: 0,
        position: 'bottom-right'
    });
    state.noticeList.push(notice)
}
function handleClose(noticeId) {
    const index = state.noticeList.findIndex(item => item.value.id === noticeId)
    if (index !== -1) {
        state.noticeList[index].value.el.close()
        state.noticeList.splice(index, 1)
    }
}

defineExpose({ handleOpen })
</script>

<style lang="scss">
.progress-notification {
    width: 130px;
    .el-notification__group {
        width: 100%;
    }
}
</style>