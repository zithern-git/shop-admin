<template>
  <div id="app">
    <RouterView></RouterView>
  </div>
</template>

<script setup lang='ts'>
import { RouterView } from 'vue-router';
// import request from './utils/request';
// import { onMounted } from 'vue';
// import { reqLogin } from '@/api/user/index'

/* // 测试axios的二次封装
onMounted(() => {
  request({
    url: '/user/login',
    method: 'post',
    data: {
      username: 'admin',
      password: '111111'
    }
  }).then(res => {
    console.log(res);
  })
}) */

/* // 测试登录接口
onMounted(() => {
  reqLogin({username: 'admin', password:'111111'});
}) */
</script>

<style scoped>
#id {
  margin: 0 auto;
  padding: 0;
  background-color: #abdbf1;
}
</style>
