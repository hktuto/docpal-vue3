<template>
    <div id="languageSwitcher" class="languageSwitchContainer">

      <ElDropdown id="languageSwitchContainerIcon"  @command="handleCommand">
        <SvgIcon   src="/icons/language.svg" round />
          <template #dropdown>
              <ElDropdownMenu v-if="userPreference && userPreference.language">
                  <ElDropdownItem v-for="locale in availableLocales" :key="locale" :command="locale"
                    :disabled="userPreference.language === locale">
                      {{$t(locale)}}
                  </ElDropdownItem>
              </ElDropdownMenu>
          </template>
        </ElDropdown>
    </div>
</template>

<script lang="ts" setup>
const router = useRouter()
const { userPreference,savePreference } = useUser()
const languageStore = useLanguage()
const { public: { availableLocales } } = useRuntimeConfig();
function handleCommand(newLocale:any) {
    userPreference.value.language = newLocale;
    savePreference()
    languageStore.loadLanguage(newLocale)
    localStorage.setItem('v_form_locale', newLocale)
}
</script>

<style lang="scss" scoped>
.languageSwitchContainer{
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: center;
}
.currentLang{
    word-break: keep-all;
    line-height: 1;
    font-size: var(--el-font-size-extra-small);
    text-align: left;
    display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: var(--app-padding);
    .langItem{
      display: inline-block;
    }
}
</style>
