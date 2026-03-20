<template>
  <el-row class="login-container">
    <!-- 左侧列：lg断点（≥1200px）占16列+全屏高度，md断点（992-1200px）占12列+满屏高度-->
    <el-col :md="12" :lg="16" class="login-left">
      <h2 class="text-5xl font-600 text-light-50">欢迎光临</h2>
      <p class="my-4 text-light-50">这是一个后台管理系统。</p>
    </el-col>

    <!-- 右侧列：lg断点（≥1200px）占8列+全屏高度，md断点（992-1200px）占12列+满屏高度-->
    <el-col :md="12" :lg="8" class="login-right">
      <h2 class="title-left">欢迎回来</h2>
      <p class="my-4 text-gray-500">账号密码登录</p>
      <el-form
        label-width="auto"
        style="max-width: 600px"
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
      >
        <el-form-item prop="username">
          <el-input
            v-model="ruleForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
          <!-- <el-input v-model="ruleForm.password" placeholder="请输入密码" show-password>
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input> -->
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            round
            class="w-full"
            @click="submitForm(ruleFormRef)"
            :disabled="loading"
          >
            {{ loading ? '登录中...' : '登 录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup lang="ts" name="LoginView">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElNotification } from 'element-plus'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { login } from '@/api/manager'
// import { useCookies } from '@vueuse/integrations'
import { setToken } from '@/utils/token'

interface RuleForm {
  username: string
  password: string
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  username: '',
  password: '',
})

const router = useRouter()
const loading = ref(false)
const errorMsg = ref('')

const rules = reactive<FormRules<RuleForm>>({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 2, max: 5, message: '长度应该为2-5', trigger: 'blur' },
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur',
    },
  ],
})

// 1. 先定义错误类型（替代 any）
interface RequestError extends Error {
  message: string
  // 可选：axios 错误的额外属性（按需添加）
  response?: {
    status: number
    data: any // 若知道格式可定义更具体的类型
  }
  request?: XMLHttpRequest
}

const submitForm = async (formEl: FormInstance | undefined) => {
  // 1. 检查 formEl 是否存在
  if (!formEl) return

  // 2. 执行 Element Plus 表单校验（必填项、格式等）
  await formEl.validate((valid) => {
    if (valid) {
      // 校验通过，才执行登录逻辑
      handleLogin()
    } else {
      console.log('表单校验失败，请检查输入')
    }
  })
}

// 把真正的登录逻辑抽离出来
const handleLogin = async () => {
  loading.value = true
  errorMsg.value = ''

  try {
    // 调试技巧 1: 打印一下发送给后端的数据，看看字段对不对
    console.log('发送的登录数据:', ruleForm)

    // 请求 Mock 接口
    const res = await login(ruleForm.username)

    // 调试技巧 2: 打印后端返回的数据
    console.log('后端返回的数据:', res.data)

    if (res.data.length > 0) {
      // 保存状态
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userInfo', JSON.stringify(res.data[0]))

      // 存储 Token 到 Cookie
      // setToken(res.data.token)

      ElNotification({
        message: '登录成功！',
        type: 'success',
        duration: 1000,
      })

      // 跳转到首页
      router.push('/index')
    } else {
      errorMsg.value = '用户名或密码错误'
      ElNotification({
        message: errorMsg.value,
        type: 'error',
        duration: 2000,
      })
    }
  } catch (error) {
    const err = error as RequestError
    // 关键：精准区分错误类型
    console.error('登录请求详细错误:', err)
    // 1. 网络错误（Mock 服务未启动/地址错误）
    if (err.message.includes('Failed to fetch') || err.message.includes('Network Error')) {
      ElNotification({
        message: '连接服务器失败，请检查 Mock 服务是否启动',
        type: 'error',
        duration: 2000,
      })
    }
    // 2. 其他错误（如接口返回格式错误、状态码错误）
    else {
      ElNotification({
        message: `登录失败：${err.message || '未知错误'}`,
        type: 'error',
        duration: 2000,
      })
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  @apply flex h-screen lg:flex-row;
}

.login-container .login-left {
  @apply md:h-1/4 lg:h-full bg-blue-400 flex items-center justify-center flex-col;
}

.title-left {
  @apply text-4xl font-600;
}
.login-container .login-right {
  @apply lg:h-full md:h-3/4 flex items-center justify-center flex-col;
}
</style>
