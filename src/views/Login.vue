<template>
  <el-row class="login-container">
    
    <!-- 左侧列：lg断点（≥1200px）占16列+全屏高度，md断点（992-1200px）占12列+满屏高度-->
    <el-col :md="12" :lg="16"
      class="login-left">
      <h2 class="text-5xl font-600 text-light-50">欢迎光临</h2>
      <p class="my-4 text-light-50">这是一个后台管理系统。</p>
    </el-col>
    
    <!-- 右侧列：lg断点（≥1200px）占8列+全屏高度，md断点（992-1200px）占12列+满屏高度-->
    <el-col :md="12" :lg="8"
     class="login-right">
      <h2 class="title-left">欢迎回来</h2>
      <p class="my-4 text-gray-500">账号密码登录</p>
      <el-form  label-width="auto" style="max-width: 600px">
        <el-form-item>
          <el-input v-model="userName" placeholder="请输入用户名" prefix-icon="User"/>
        </el-form-item>
        <el-form-item>
          <!-- <el-input v-model="password" placeholder="请输入密码" prefix-icon="Lock"/> -->
          <el-input v-model="password" placeholder="请输入密码" >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round class="w-full">登录</el-button>
        </el-form-item>
     </el-form>
    </el-col>
  </el-row>
</template>

<script setup lang='ts'>
import {ref} from 'vue'

const userName = ref('')
const password = ref('')
</script>

<style scoped>
.login-container {
  @apply flex h-screen lg:flex-row;
}

.login-container .login-left {
  @apply md:h-1/3 lg:h-full bg-blue-400 flex items-center justify-center flex-col;
}

.title-left {
  @apply text-4xl font-600
}
.login-container .login-right {
  @apply lg:h-full md:h-2/3 flex items-center justify-center flex-col;
}
</style>
