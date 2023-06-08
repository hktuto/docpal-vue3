<template>
<LoadingBg />
<el-card class="formContainer">
    <div class="flex-x-start">
        <Logo class="logo" mode="withName" />
    </div>
    <h1>{{$t(`tip_${tip}`)}}</h1>
</el-card>
</template>


<script lang="ts" setup>
const route = useRoute()
const tip = computed(() => {
    return route.query.tip || 'publicToLogin'
})
</script>

<style lang="scss" scoped>
.el-card {
    // position: fixed;
    min-width: 300px;
    max-width: 600px;
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;

    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .logo{
        width: 80%;
        max-width: 200px;
        margin: 0 auto var(--el-component-size-small) auto;
    }
    h1 {
        text-align: center;
    }
}
</style>
