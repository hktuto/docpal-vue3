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
const {public:{availableLocales}} = useRuntimeConfig();
const { userPreference, savePreference } = useUser()
function handleCommand(newLocale) {
    locale.value = newLocale
    userPreference.value.language = newLocale;
    savePreference()
    // TODO : save to user preference
}

onMounted(() => {
    console.log("onMounted", userPreference.value)
    locale.value = userPreference.value.language;
})
</script>

<style lang="scss" scoped>
.currentLang{
    display: block;
    word-break: keep-all;
}
</style>