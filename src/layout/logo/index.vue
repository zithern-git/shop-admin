<template>
  <div class="logo">
    <img :src="setting.logo" class="logo-img" alt="后台logo" v-if="setting.logoHidden" />
    <p>{{ setting.title }}</p>
  </div>
</template>
<script setup lang="ts">
import { setting } from '@/setting'
 defineOptions({
    name: 'Logo'
  })
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  display: flex;
  align-items: center;
  padding: 20px;
  .logo-img {
    width: 40px;
    height: $base-menu-logo-height;
  }
  p {
    color: aliceblue;
    font-size: $base-logo-title-fontSize;
    margin-left: 10px;
  }
}
</style>
