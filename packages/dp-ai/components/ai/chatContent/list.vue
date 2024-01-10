<template>
    <div class="ai-chat-record-container">
        <template v-for="item in chatRecord">
            <div v-if="item.type === 'question'"  :key="item.id" class="ai-chat--question">{{ item.text }}</div>
            <div v-else-if="item.type === 'search'"  :key="item.id" class="ai-chat--search">
                <div>
                    <SvgIcon src="/icons/tools/answer.svg"></SvgIcon>
                </div>
                
                <!-- {{ item }} -->
            </div>
            <div v-else-if="item.type === 'odd'" class="flex-x-start">
                <SvgIcon src="/icons/tools/answer.svg"></SvgIcon>
                {{ item.type }}
            </div>
            <div v-else-if="item.type === 'loading'" class="flex-x-start">
                <SvgIcon src="/icons/tools/answer.svg"></SvgIcon>
                {{ $t('ai.generating') }}{{ item.type }}
            </div>
        </template>
    </div>
</template>
<script lang="ts" setup>
const props = withDefaults(defineProps<{
    chatRecord: any
}>(),{
    chatRecord: []
})
</script>
<style lang="scss" scoped>
.ai-chat-record-container {
    display: flex;
    flex-direction: column;
    gap: var(--app-padding);
}
.ai-chat--question {
    max-width: 80%;
    background-color: var(--primary-color);
    padding: var(--app-padding);
    color: var(--color-grey-050);
    text-align: left;
    border-radius: 4px;
    align-self: end;
    word-break: break-all; 
}
.ai-chat--search {

}
</style>