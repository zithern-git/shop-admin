<template>
  <div class="profile-container">
    <h2>{{userStore.username}}</h2>
  </div>
</template>

<script setup lang="ts">
// 引入组合式API函数之生命周期函数
import { onMounted } from 'vue'
// 获取用户仓库
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
// 目前首页挂载完毕发请求获取用户信息
onMounted(() => {
  userStore.userInfo()
})

</script>
