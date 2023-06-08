<template>
    <div class="userThumbnailContainer">
        {{displayName}}
    </div>
</template>

<script lang="ts" setup>
const {user} = useUser();
const displayName = computed(() => user.value.username.substring(0,2))
</script>

<style lang="scss" scoped>
.userThumbnailContainer{
    --thumbSize: 32px;
    width: var(--thumbSize);
    height: var(--thumbSize);
    border-radius: var(--el-border-radius-round);
    background-color: var(--primary-color);
    display: grid;
    place-items: center;
    color: white;
    font-weight: 700;
    text-transform: capitalize;
    border: 1px solid var(--color-grey-000);

}
</style>