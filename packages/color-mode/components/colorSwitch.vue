<template>
  <SvgIcon src="/icons/light.svg" round @click="toggleColor" />
</template>

<script lang="ts" setup>
import { Sunny, Moon } from '@element-plus/icons-vue'
const colorMode = useColorMode();
const {userPreference,savePreference} = useUser()
function toggleColor() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
    // save user preference
    userPreference.value.color = colorMode.preference;
    savePreference()
}

onMounted(() => {
    // get user preference
    colorMode.preference = userPreference.value.color
})
</script>

<style lang="scss" scoped>
.colorSwitchContainer{
    width: 40px;
    height: 40px;
    border-radius: var(--el-border-radius-round);

    //background-color: var(--color-grey-050);
    transform: all .5s ease-in-out;
    font-size: 16px;
    display: grid;
    place-items: center;
    &:hover{
        background-color: var(--color-grey-800);
        color: var(--color-grey-000);
    }
}
</style>
