<template>
    <div class="languageSwitchContainer">

      <ElDropdown  @command="handleCommand">
        <SvgIcon src="/icons/language.svg" round />
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

const {locale} = useI18n()
const {userPreference,savePreference} = useUser()
const {public:{availableLocales}} = useRuntimeConfig();


const filterLang = computed(() => availableLocales.filter((item:string) => item !== locale.value))
function handleCommand(newLocale:any) {
    locale.value = newLocale
    userPreference.value.language = newLocale;
    savePreference()
    // TODO : save to user preference
}

onMounted(() => {
    locale.value = userPreference.value?.language || 'en';
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
