<template>
  <el-card style="margin-bottom: 10px;">
    <el-form :inline="true" style="display: flex; justify-content: space-between; align-items: center; height: 50px;">
      <el-form-item label="用户名称">
        <el-input v-model="keyword" placeholder="请输入用户名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="!keyword" type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card>
    <el-button type="primary" icon="Plus" @click="addRole">添加角色</el-button>
    <el-table :data="allRole" border style="margin: 10px 0;">
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="id" align="center" prop="id"></el-table-column>
      <el-table-column label="角色名称" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center" width="360px">
        <!-- row: 已有的职位对象 -->
        <template #default="{row}">
          <el-button type="primary" icon="User" @click="drawer = true">分配权限</el-button>
          <el-button type="primary" icon="Edit">编辑</el-button>
          <el-button type="primary" icon="Delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout="prev,pager,next,jumper,->,sizes,total"
      :total="total"
      @size-change="sizeChange"
      @current-change="getHasRole"
    />
    <!-- 对话框 -->
    <!-- <el-dialog v-model="dialogVisible" :title="`${role.id ? '添加' : '更新'}`"> -->
    <el-dialog v-model="dialogVisible" title="添加">
      <span>角色名称</span>
      <el-input placeholder="请填写角色名称" style="width: 200px; margin: 0 10px;"/>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </template>
    </el-dialog>
    <!-- 抽屉 -->
     <el-drawer v-model="drawer">
      <template #header>
        <h3>分配权限</h3>
      </template>
      <template #default>
        <el-form>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="drawer = false">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang='ts'>
import {ref, onMounted} from 'vue'
import {reqAllRoleList} from '@/api/acl/role'
import type { RoleResponseData, Records } from '@/api//acl/role/type'
// 引入骨架的仓库
import useLayoutSettingStore from '@/store/modules/setting'

// 当前页码
const pageNo = ref<number>(1)
// 一页展示几条数据
const pageSize = ref<number>(3)
// 职位总个数
const total = ref<number>(0)
// 存储全部已有的职位
const allRole = ref<Records>([])
// 搜索职位关键字
const keyword = ref<string>('')
//
const layoutSettingStore = useLayoutSettingStore()
const drawer = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)

// 获取全部用户信息的方法|分页器当前页码发生变化的回调
const getHasRole = async (pager = 1) => {
  // 修改当前页码
  pageNo.value = pager
  const result: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
  if (result.code === 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}

const addRole = () => {
  dialogVisible.value = true
}

// 组件挂载完毕
onMounted(() => {
  // 获取职位请求
  getHasRole()
})

// 分页器下拉菜单的回调
const sizeChange = () => {
  getHasRole()
}

// 搜索按钮的回调
const search = () => {
  // 根据关键字再次发请求
  getHasRole()
  // 清空关键字
  keyword.value = ''
}

// 重置按钮的回调
const reset = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}
</script>

<style scoped>
</style>
