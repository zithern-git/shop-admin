<template>
  <div class="login-container">
    <h2>系统登录</h2>
    <p v-if="errorMsg" class="text-red-500">{{ errorMsg }}</p>
    
    <input v-model="form.username" type="text" placeholder="用户名 (admin)" />
    <input v-model="form.password" type="password" placeholder="密码 (123456)" />
    
    <button @click="handleLogin" :disabled="loading">
      {{ loading ? '登录中...' : '登 录' }}
    </button>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const errorMsg = ref('')

const form = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!form.username || !form.password) return alert('请输入内容')
  
  loading.value = true
  errorMsg.value = ''

  try {
    // 请求 Mock 接口
    const res = await axios.get('http://localhost:3000/users', {
      params: form
    })

    if (res.data.length > 0) {
      // 保存状态
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userInfo', JSON.stringify(res.data[0]))
      // 跳转到个人中心
      router.push('/profile')
    } else {
      errorMsg.value = '用户名或密码错误'
    }
  } catch (err) {
    console.error(err)
    alert('连接服务器失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 样式省略，可参考上面的 HTML 版本 */
</style>