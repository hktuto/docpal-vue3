<template>
    <div class="actionIconContainer">
        <div class="actionIcon" @click="copyPath">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-copy"
            >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M9 9V22H22"></path>
            </svg>
        </div>
    </div>
</template>

<script lang="ts" setup>

const props = defineProps<{
    doc: any
}>()

function copyPath(){
    // copy path to clipboard
    const el = document.createElement('textarea');
    el.value = props.doc.path;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    // show notification using element-plus 
    ElNotification({
        title: 'Success',
        message: 'Path copied to clipboard',
        type: 'success',
        duration: 2000
    });
}
</script>