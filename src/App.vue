<template>
  <div id="app">
    <!-- 路由出口：所有页面都会在这里渲染 -->
    <router-view />
  </div>
</template>

<script setup>
// 无需额外逻辑
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}
</style>
