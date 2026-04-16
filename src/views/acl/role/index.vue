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
          <el-button type="primary" icon="User" @click="setPermission(row)">分配权限</el-button>
          <el-button type="primary" icon="Edit" @click="updateRole(row)">编辑</el-button>
          <el-popconfirm :title="`确认要删除${row.roleName}吗？`"  @confirm="deleteRole(row.id)">
            <template #reference>
              <el-button type="primary" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
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
    <!-- 添加职位与更新已有职位的结构：对话框 -->
    <el-dialog v-model="dialogVisible" :title="roleParams.id ? '更新' : '添加'">
      <el-form ref="form" :rules="rules" :model="roleParams">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleParams.roleName" placeholder="请填写角色名称"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button :disabled="roleParams.roleName.length >= 2 ? false : true" type="primary" @click="save">确定</el-button>
      </template>
    </el-dialog>
    <!-- 分配角色的菜单权限与按钮的权限：抽屉 -->
     <el-drawer v-model="drawer">
      <template #header>
        <h3>分配权限</h3>
      </template>
      <template #default>
        <!-- 树形控件 -->
         <el-tree
            ref="treeRef"
            style="max-width: 600px"
            :data="menuArr"
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="selectArr"
            :props="props"
            check-strictly
          />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang='ts'>
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList, reqAssignPermission, reqRemoveRole} from '@/api/acl/role'
import type { RoleResponseData, Records, RoleData, MenuResponseData, MenuList, AssignData } from '@/api//acl/role/type'
// 引入骨架的仓库
import useLayoutSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus'

// 当前页码
const pageNo = ref<number>(1)
// 一页展示几条数据
const pageSize = ref<number>(5)
// 职位总个数
const total = ref<number>(0)
// 存储全部已有的职位
const allRole = ref<Records>([])
// 搜索职位关键字
const keyword = ref<string>('')
const layoutSettingStore = useLayoutSettingStore()
// 收集新增角色数据
const roleParams = ref<RoleData>({
  roleName: '',
})
// 控制对话框是否可见
const dialogVisible = ref<boolean>(false)
// 获取组件实例
const form = ref<any>()
// 控制抽屉显示与隐藏
const drawer = ref<boolean>(false)
// 定义数组存储用户权限的数据
const menuArr = ref<MenuList>([])
// 准备一个数组：数组用于存储勾选的节点id（最后一级）
const selectArr = ref<number[]>([])
// 树形控件ref
const treeRef = ref<any>()
// 收集新增角色权限
const selectParams = ref<AssignData>({
  roleId: 0,
  permissionId: []
})

// 自定义校验规则的回调
const validateRoleName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('角色名称不能少于2位'))
  }
}

// 角色校验规则
const rules = reactive({
    // 用户姓名
    roleName: [{ validator: validateRoleName, trigger: 'blur', required: true }]
  })


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

// 添加角色按钮的回调
const addRole = () => {
  // 对话框显示
  dialogVisible.value = true
  // 清空表单数据
  Object.assign(roleParams.value, {
    roleName: '',
    id: 0,
  })
  // 清空上一次表单校验错误结果
  nextTick(() => {
    form.value.clearValidate()
  })
}

// 编辑角色
const updateRole = async (row: RoleData) => {
  // 显示对话框
  dialogVisible.value = true
  Object.assign(roleParams.value, row)
   // 清空上一次表单校验错误结果
  nextTick(() => {
    form.value.clearValidate()
  })
}

// 确认按钮的回调
const save = async () => {
  // 表单校验结果，通过则发请求，不通过则不应该发生请求
  await form.value.validate()
  // 添加职位|更新已有职位的请求
  const result: any = await reqAddOrUpdateRole(roleParams.value)
  if (result.code === 200) {
    // 对话框隐藏
    dialogVisible.value = false
    ElMessage.success(roleParams.value.id ? '更新成功' : '添加成功')
    // 再次获取全部已有的职位
    getHasRole(roleParams.value.id ? pageNo.value : 1)
  } else {
    ElMessage.error(roleParams.value.id ? '更新失败' : '添加失败')
  }
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

// 分配权限按钮的回调，row：已有的角色的数据
const setPermission = async (row: RoleData) => {
  // 显示抽屉
  drawer.value = true
  // 收集当前要分类权限的角色的数据
  Object.assign(roleParams.value, row)
  // 根据角色获取权限的数据
  const result: MenuResponseData = await reqAllMenuList(roleParams.value.id as number)
  if (result.code === 200) {
    menuArr.value = result.data
    // 使用 nextTick 确保数据加载后再计算选中节点
    nextTick(() => {
      selectArr.value = filterSelectArr(menuArr.value, [])
      // 使用 setCheckedKeys 动态设置选中状态
      treeRef.value?.setCheckedKeys(selectArr.value)
    })
  }
}

const filterSelectArr = (allData: MenuList, initArr: number[]) => {
  allData.forEach(item => {
    // 只要 select 为 true 就加入数组（包括父节点和叶子节点）
    if(item.select) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}

// 树形控件
const props = {
  children: 'children',
  label: 'name',
}

// 确定按钮的回调
const confirm = async () => {
  selectParams.value.roleId = roleParams.value.id as number
  // 从树控件获取实际选中的节点
  const checkedKeys = treeRef.value?.getCheckedKeys() || []
  const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys() || []
  selectParams.value.permissionId = [...checkedKeys, ...halfCheckedKeys]
  // 下发权限
  const result:any = await reqAssignPermission(selectParams.value)
  if (result.code === 200) {
    // 抽屉关闭
    drawer.value = false
    // 提示信息
    ElMessage.success(result.message)
    // 页面刷新
    window.location.reload()
  }
}

// 删除按钮的回调
const deleteRole = async (id: number) => {
  const result: any = await reqRemoveRole(id)
  if (result.code === 200) {
    // 提示信息
    ElMessage.success(result.message)
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
</script>

<style scoped>
</style>
