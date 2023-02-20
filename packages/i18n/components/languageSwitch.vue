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

function handleCommand(newLocale) {
    locale.value = newLocale
    // TODO : save to user preference
}
</script>

<style lang="scss" scoped>
.currentLang{
    display: block;
    word-break: keep-all;
}
</style>