<template>
  <el-table
    :data="permissionArr"
    style="width: 100%; margin-bottom: 20px;"
    row-key="id"
    border
    >
    <el-table-column label="名称" prop="name" size="small"></el-table-column>
    <el-table-column label="权限值" prop="permissionValue" size="small"></el-table-column>
    <el-table-column label="修改时间" prop="updateTime" size="small"></el-table-column>
    <el-table-column label="操作">
      <!-- row：已有的菜单对象|按钮对象的数据 -->
      <template #default="{row}">
        <el-button type="primary"  :disabled="row.level === 3 ? true : false">{{ row.level === 2 ? '添加功能' : '添加菜单' }}</el-button>
        <el-button type="primary" :disabled="row.level === 0 ? true : false">编辑</el-button>
        <el-popconfirm title="确定要删除吗？">
          <template #reference>
            <el-button type="primary"  :disabled="row.level === 0 ? true : false">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
// 引入获取菜单请求API
import { reqAllPermission } from '@/api/acl/menu'
// 引入ts类型
import type { PermissionResponseData, PermissionList } from '@/api/acl/menu/type'
// 存储菜单的数据
const permissionArr = ref<PermissionList>([])

  // 获取菜单数据的方法
const getAllPermission = async () => {
  const result: PermissionResponseData = await reqAllPermission()
  if (result.code === 200) {
    permissionArr.value = result.data
  }
}

// 组件挂载完毕
onMounted(() => {
  getAllPermission()
})
</script>

<style scoped>
</style>
