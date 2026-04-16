<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatar" alt="" class="avatar" />
      <div class="bottom">
        <h3 class="title">{{ getTime() }}好！{{ userStore.username }}</h3>
        <p class="subtitle">后台测试管理系统</p>
      </div>
    </div>
  </el-card>
  <div class="welcome">
    <svg-icon name="welcome" width="500px" height="500px"></svg-icon>
  </div>
</template>

<script setup lang="ts">
  import { getTime } from '@/utils/time'
  // 引入用户仓库，获取当前用户的头像、昵称
  import useUserStore from '@/store/modules/user'

  const userStore = useUserStore()
</script>

<style scoped lang="scss">
  .box {
    display: flex;
    align-items: center;
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
    .bottom {
      margin-left: 20px;
      .title {
        font-size: 30px;
        font-weight: 900;
        margin-bottom: 30px;
      }
      .subtitle {
        font-size: 16px;
        font-weight: 500;
        font-style: italic;
        color: rgb(91, 152, 152);
      }
    }
  }

  .welcome {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
</style>
