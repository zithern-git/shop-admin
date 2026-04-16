<template>
  <el-table :data="permissionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
    <el-table-column label="名称" prop="name" size="small"></el-table-column>
    <el-table-column label="权限值" prop="permissionValue" size="small"></el-table-column>
    <el-table-column label="修改时间" prop="updateTime" size="small"></el-table-column>
    <el-table-column label="操作">
      <!-- row：已有的菜单对象|按钮对象的数据 -->
      <template #default="{ row }">
        <el-button
          type="primary"
          :disabled="row.level === 3 ? true : false"
          @click="addPermission(row)"
          >{{ row.level === 2 ? '添加功能' : '添加菜单' }}</el-button
        >
        <el-button
          type="primary"
          @click="updatePermission(row)"
          :disabled="row.level === 0 ? true : false"
          >编辑</el-button
        >
        <el-popconfirm
          :title="`确定要删除${row.name}吗？`"
          width="260"
          @confirm="removePermission(row.id)"
        >
          <template #reference>
            <el-button type="primary" :disabled="row.level === 0 ? true : false">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- 对话框组件：添加或者更新已有的菜单的数据结构 -->
  <el-dialog v-model="dialogVisible" :title="menuData.id ? '编辑菜单' : '添加菜单'">
    <!-- 表单组件：收集新增与已有的菜单的数据 -->
    <el-form>
      <el-form-item label="名称"
        ><el-input placeholder="请输入名称" v-model="menuData.name"
      /></el-form-item>
      <el-form-item label="权限值"
        ><el-input placeholder="请输入权限值" v-model="menuData.permissionValue"
      /></el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  // 引入获取菜单请求API
  import { reqAllPermission, reqAddOrUpdatePermission, reqRemovePermission } from '@/api/acl/menu'
  // 引入ts类型
  import type {
    PermissionResponseData,
    PermissionList,
    Permission,
    MenuParams,
  } from '@/api/acl/menu/type'
  import { ElMessage } from 'element-plus'
  // 存储菜单的数据
  const permissionArr = ref<PermissionList>([])
  // 控制对话框的显示与隐藏
  const dialogVisible = ref<boolean>(false)
  // 携带的参数
  const menuData = ref<MenuParams>({
    id: 0,
    name: '',
    level: 0,
    permissionValue: '',
    pid: 0,
  })

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

  // 添加菜单按钮的回调
  const addPermission = async (row: Permission) => {
    // 显示对话框
    dialogVisible.value = true
    // 清空数据
    Object.assign(menuData.value, {
      id: 0,
      name: '',
      level: 0,
      permissionValue: '',
      pid: 0,
    })
    // 收集新增的菜单的level数值
    menuData.value.level = row.level + 1
    // 给谁新增子菜单
    menuData.value.pid = row.id as number
  }

  // 编辑按钮的回调
  const updatePermission = async (row: Permission) => {
    // 显示对话框
    dialogVisible.value = true
    // 收集已有的菜单的数据（排除children，避免树形子节点被带入请求）
    const { children, ...rest } = row as any
    menuData.value = rest
  }

  // 对话框确定按钮的回调
  const save = async () => {
    // 发请求：新增子菜单|更新某一个已有菜单的数据
    const result: any = await reqAddOrUpdatePermission(menuData.value)
    if (result.code === 200) {
      // 隐藏对话框
      dialogVisible.value = false
      // 提示信息
      ElMessage.success(result.message)
      // 再次获取全部最新的菜单的数据
      getAllPermission()
    } else {
      ElMessage.error(result.message)
    }
  }

  const removePermission = async (id: number) => {
    const result: any = await reqRemovePermission(id)
    if (result.code === 200) {
      ElMessage.success(result.message)
      getAllPermission()
    } else {
      ElMessage.error(result.message)
    }
  }
</script>

<style scoped></style>
