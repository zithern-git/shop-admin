<template>
  <div class="profile-container">
    <h2>后台首页</h2>
    <el-button>设置</el-button>
    <el-button>读取</el-button>
    <el-button>删除</el-button>
    <button @click="handleLogout">退出登录</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
import request from '@/utils/request';
import { removeToken, getToken } from '@/utils/token';
import { ElMessage } from 'element-plus';

const cookies = useCookies(['locale'])
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