<template>
    <div class="languageSwitchContainer">
        
        <ElDropdown  @command="handleCommand">
            <div class="currentLang">
                {{$t(locale)}}
            </div>
            <template #dropdown>
                <ElDropdownMenu>
                    <ElDropdownItem v-for="locale in availableLocales" :key="locale" :command="locale">
                        {{$t(locale)}}
                    </ElDropdownItem>
                </ElDropdownMenu>
            </template>
        </ElDropdown>
    </div>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
const {locale} = useI18n()
const {userPreference,savePreference} = useUser()
const {public:{availableLocales}} = useRuntimeConfig();

function handleCommand(newLocale) {
    locale.value = newLocale
    userPreference.value.language = newLocale;
    savePreference()
    // TODO : save to user preference
}

onMounted(() => {
    locale.value = userPreference.value.language
})
</script>

<style lang="scss" scoped>
.languageSwitchContainer{
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: center;
}
.currentLang{
    display: block;
    word-break: keep-all;
    line-height: 1;
    font-size: var(--el-font-size-extra-small);
}
</style>