<template>
    <div class="actionIconContainer">
        <el-tooltip content="share">
            <el-icon @click="iconClickHandler">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M128 192v640h768V320H485.76L357.504 192H128zm-32-64h287.872l128.384 128H928a32 32 0 0 1 32 32v576a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32zm384 416V416h64v128h128v64H544v128h-64V608H352v-64h128z"></path></svg>
            </el-icon>
        </el-tooltip>
        <el-dialog v-model="dialogOpened" append-to-body>

        </el-dialog>
    </div>
</template>

<script lang="ts" setup>

const dialogOpened = ref(false)

const props = defineProps<{
    doc: any,
    selected: any[]
}>()

function iconClickHandler(){
    dialogOpened.value = true
    // open upload dialog
}
</script>