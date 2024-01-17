

export default defineNuxtPlugin(async({$config}) => {
  const config = useRuntimeConfig()
  const setting = await fetch('/siteSetting.json').then(res => res.json())
  config.public = Object.assign(config.public, setting);
})
