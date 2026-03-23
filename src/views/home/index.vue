<template>
  <div class="profile-container">
    <h2>后台首页</h2>
    <hr>
    <button @click="handleLogout">退出登录</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userInfo = ref({})

onMounted(() => {
  // 从 localStorage 取出用户信息
  const raw = localStorage.getItem('userInfo')
  if (raw) userInfo.value = JSON.parse(raw)
})

const handleLogout = () => {
  localStorage.clear()
  router.push('/login')
}
</script>
