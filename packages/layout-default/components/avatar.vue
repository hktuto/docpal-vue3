<template>
    <el-tooltip
        v-if="_userName"
        class="box-item"
        effect="dark"
        :content="userName"
        placement="top-start"
      >
        <div id="dp-avatar">{{_userName}}</div>
    </el-tooltip>
</template>

<script lang="ts" setup>
const userName:string = useUser().getUserName()
const _userName = computed(() => {
    if(!userName) return ''
    const nameList = userName.split(' ')
    if (nameList.length === 1 && userName.length > 1) return userName.charAt(0).toUpperCase() + userName.charAt(1).toLowerCase()
    return nameList.reduce((prev, name, index) => {
        if (index < 2) prev += name.charAt(0).toUpperCase()
        return prev
    }, '')
})
</script>
<style lang="scss" scoped>
#dp-avatar {
    color: var(--primary-color);
    background-color: var(--icon-bg-color, var(--color-grey-150));
    border-radius: 50%;
    width: 22px;
    height: 22px;
    line-height: 23px;
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    &:hover {
        opacity: 0.8;
        // color: var(--icon-hover-color, --color-grey-0000);
    } 
}
</style>
