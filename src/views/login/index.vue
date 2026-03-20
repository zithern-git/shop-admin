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
        :model="loginForm"
        :rules="rules"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round class="w-full" @click="login()" :disabled="loading">
            {{ loading ? '登录中...' : '登 录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormRules } from 'element-plus'
import { ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'
// 引入用户相关的小仓库
import useUserStore from '@/store/modules/user'
// 引入获取当前时间的函数
import { getTime } from '@/utils/time'

interface RuleForm {
  username: string
  password: string
}

const validatorUsername = (rule: any, value: any, callback: any) => {
  // rule：即为校验规则对象
  // value：即为表单元素文本内容
  // 函数：如果符合条件callback放行通过即为
  // 如果不符合条件callback方法，注入错误提示信息
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少为5位'))
  }
}

const validatorPassword = (rule: any, value: any, callback: any) => {
  // rule：即为校验规则对象
  // value：即为表单元素文本内容
  // 函数：如果符合条件callback放行通过即为
  // 如果不符合条件callback方法，注入错误提示信息
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少为6位'))
  }
}

const rules = reactive<FormRules<RuleForm>>({
  username: [
    /*     { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 2, max: 5, message: '长度应该为2-5', trigger: 'change' }, */
    { validator: validatorUsername, trigger: 'change' },
  ],
  password: [
    // { required: true, message: '密码不能为空', trigger: 'blur' }
    { validator: validatorPassword, trigger: 'change' },
  ],
})

// 获取路由器
const $router = useRouter()
// 定义变量控制按钮加载效果
const loading = ref(false)
const useStore = useUserStore()
// 收集账号与密码的数据
const loginForm = reactive<RuleForm>({
  username: 'admin',
  password: '111111',
})

const login = async () => {
  // 加载效果，开始加载
  loading.value = true
  // 点击登录按钮以后，通知仓库发登录请求，
  // 请求成功则跳转到首页展示数据的地方
  // 请求失败，则弹出对应的登录失败信息
  try {
    // 可以书写.then语法  保证登录成功
    await useStore.userLogin(loginForm)
    // 编程式导航跳转到展示数据首页
    $router.push('/')

    // 登录成功提示信息
    ElNotification({
      message: '登录成功',
      type: 'success',
      title: `Hi,${getTime()}好`,
      duration: 2000,
    })
  } catch (err) {
    ElNotification({
      message: (err as Error).message, // (err as Error) 是 TypeScript 中的类型断言（Type Assertion）
      type: 'error',
      duration: 2000,
    })
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
