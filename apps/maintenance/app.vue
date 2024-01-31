<template>
  <div class="main">
    <div class="contain">
      <LogoCacheWhite class="loginLogo" />
      Maintenance Mode
    </div>
    <LoadingBg  />
  </div>
</template>

<style lang="scss" scoped>
.contain{
  height: 100%;
  width:100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  gap: 0;
  font-size: 2rem;
  color: #fff;
}
.main{
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
}
</style>

