<template>
  <template v-for="(item,index) in menuList" :key="item.path">
    <!-- 没有子路由 -->
    <template v-if="!item.children" >
      <el-menu-item :index="item.path" v-if="!item.meta.hidden">
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由且只有一个 -->
    <template v-if="item.children?.length === 1 && item.children[0].path && item.children[0].meta?.title">
      <el-menu-item :index="item.children[0].path" v-if="item.children[0].meta.hidden">
        <template #title>
          <el-icon>
            <component :is="item.children[0].meta.icon"></component>
          </el-icon>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由且多于1个 -->
    <el-sub-menu v-if="item.children?.length > 1" :index="item.path">
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{  item.meta.title  }}</span>
        </template>
        <!-- 递归自身 -->
        <Menu :menuList="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
// 直接在脚本内声明 name，无需拆分标签（VUE3.3+原生支持）
defineOptions({
  name: 'Menu'
})

// 获取父组件传递过来的全部路由数组
defineProps(['menuList'])
</script>
<!-- <script lang="ts"> // VUE2的写法
export default {
  name: 'Menu'
}
</script> -->

<style scoped></style>
