<template>
  <el-card style="margin-bottom: 20px">
    <div style="display: flex; justify-content: space-between; align-items: center">
      <div>
        <span>用户名：</span>
        <el-input placeholder="请输入用户名" style="width: 200px" />
      </div>
      <div>
        <el-button type="primary" size="default">搜索</el-button>
        <el-button size="default">重置</el-button>
      </div>
    </div>
  </el-card>
  <el-card>
    <el-form>
      <el-form-item>
        <el-button type="primary" @click="addUser">添加</el-button>
        <el-button type="danger">批量删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-table :data="userArr" border>
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column label="#" type="index" align="center"></el-table-column>
          <el-table-column label="ID" align="center" prop="id"></el-table-column>
          <el-table-column
            label="用户名字"
            align="center"
            prop="username"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="用户名称"
            align="center"
            prop="name"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="用户角色"
            align="center"
            prop="role"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="更新时间"
            align="center"
            prop="updateTime"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作" width="300px" align="center">
            <template #default="{ row }">
              <el-button type="primary" size="small" icon="User" @click="setRole(row)"
                >分配角色</el-button
              >
              <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)"
                >编辑</el-button
              >
              <el-button type="primary" size="small" icon="Delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 分页器 -->
      <el-form-item>
        <div style="width: 100%; text-align: right; margin-top: 15px">
          <el-pagination
            v-model:current-page="pageNo"
            v-model:page-size="pageSize"
            :page-sizes="[5, 7, 9, 11]"
            :background="true"
            layout="prev,pager,next,jumper,->,sizes,total"
            :total="total"
            @size-change="getHasUser()"
            @current-change="getHasUser"
          />
        </div>
      </el-form-item>
    </el-form>
    <!-- 抽屉结构：完成添加新的用户账号更新已有的账号信息 -->
    <el-drawer v-model="drawer" :title="userParams.id ? '修改用户' : '添加用户'">
      <el-form ref="formRef" :rules="rules" :model="userParams">
        <el-form-item label="用户姓名" prop="username"
          ><el-input v-model="userParams.username" placeholder="请填写用户名字"
        /></el-form-item>
        <el-form-item label="用户昵称" prop="name"
          ><el-input v-model="userParams.name" placeholder="请填写用户昵称"
        /></el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id"
          ><el-input v-model="userParams.password" placeholder="请填写用户密码"
        /></el-form-item>
      </el-form>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 抽屉结构：用于某一个已有的账号进行职位分配 -->
    <el-drawer v-model="drawer1">
      <template #header>
        <h4>分配角色用户</h4>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用户姓名">
            <el-input :disabled="true" v-model="userParams.username" />
          </el-form-item>
          <el-form-item label="角色列表">
            <div style="display: flex; flex-direction: column; gap: 8px">
              <el-checkbox
                label="全选"
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
              />
              <el-checkbox-group v-model="checkedRoles" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="(item, index) in allRoles" :key="item.id" :value="item">{{
                  item.roleName
                }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer1 = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive, nextTick } from 'vue'
  import { reqUserInfo, reqAddOrUpdateUser, reqAllRole, reqSetUserRole } from '@/api/acl/user'
  import type {
    UserResponseData,
    Records,
    User,
    AllRoleResponseData,
    AllRole,
    SetRoleData,
  } from '@/api/acl/user/type'
  import { ElMessage } from 'element-plus'
  import type { CheckboxValueType } from 'element-plus'

  // 默认页码
  const pageNo = ref<number>(1)
  // 一页展示几条数据
  const pageSize = ref<number>(5)
  // 存储总用户数
  const total = ref<number>(0)
  // 存储全部用户的数组
  const userArr = ref<Records>([])
  // 定义响应式数据控制抽屉的显示与隐藏
  const drawer = ref<boolean>(false)
  // 收集用户信息的响应式数据
  const userParams = ref<User>({
    id: 0,
    name: '',
    password: '',
    username: '',
  })
  // 控制分配角色抽屉显示与隐藏
  const drawer1 = ref<boolean>(false)
  // 全选复选框收集数据：是否全选
  const checkAll = ref<boolean>(false)
  // 设置不确定状态，仅负责样式控制
  const isIndeterminate = ref<boolean>(true)
  // 当前用户已有的职位
  const checkedRoles = ref<AllRole>([])
  // 存储全部职位的数据
  const allRoles = ref<AllRole>([])

  // 全选复选框的change事件
  const handleCheckAllChange = (val: CheckboxValueType) => {
    // val：true(全选)|false(没有全选)
    checkedRoles.value = val ? allRoles.value : []
    // 不确定的样式（确定样式）
    isIndeterminate.value = false
  }
  // 底部的复选框的change事件
  const handleCheckedCitiesChange = (value: CheckboxValueType[]) => {
    // 已经勾选的这些项目的长度
    const checkedCount = value.length
    // 代表：勾选上的项目个数与全部的职位个数相等，顶部的复选框勾选上
    checkAll.value = checkedCount === allRoles.value.length
    // 不确定的样式
    isIndeterminate.value = checkedCount > 0 && checkedCount < allRoles.value.length
  }

  // 获取el-form组件实例
  const formRef = ref<any>()

  // 校验用户姓名的回调函数
  const validateUsername = (rule: any, value: any, callback: any) => {
    if (!value || value.trim().length < 5) {
      callback(new Error('用户姓名不能少于5位'))
    } else {
      callback()
    }
  }
  // 校验用户昵称的回调函数
  const validateName = (rule: any, value: any, callback: any) => {
    if (!value || value.trim().length < 3) {
      callback(new Error('用户昵称不能少于5位'))
    } else {
      callback()
    }
  }
  // 校验用户密码的回调函数
  const validatePassword = (rule: any, value: any, callback: any) => {
    if (!value || value.trim().length < 6) {
      callback(new Error('用户密码不能少于6位'))
    } else {
      callback()
    }
  }

  //表单校验的规则对象
  const rules = reactive({
    // 用户姓名
    username: [{ validator: validateUsername, trigger: 'blur', required: true }],
    // 用户昵称
    name: [{ validator: validateName, trigger: 'blur', required: true }],
    // 用户密码
    password: [{ validator: validatePassword, trigger: 'blur', required: true }],
  })

  // 获取全部已有的用户信息
  const getHasUser = async (pager = 1) => {
    pageNo.value = pager
    const result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value)
    if (result.code === 200) {
      total.value = result.data.total
      userArr.value = result.data.records
    }
  }

  // 添加用户按钮的回调
  const addUser = async () => {
    // 抽屉显示出来
    drawer.value = true
    Object.assign(userParams.value, {
      id: 0,
      name: '',
      password: '',
      username: '',
    })
    // 清空上一次的所有校验
    nextTick(() => {
      formRef.value.clearValidate()
    })
  }

  // 分配角色按钮的回调
  const setRole = async (row: User) => {
    // 存储已有的用户信息
    Object.assign(userParams.value, row)
    // 获取全部的职位的数据与当前用户已有的职位的数据
    const result: AllRoleResponseData = await reqAllRole(row.id as number)
    if (result.code === 200) {
      // 存储全部的职位
      allRoles.value = result.data.allRolesList
      // 存储当前用户已有的职位
      checkedRoles.value = result.data.assignRoles
      // 显示抽屉
      drawer1.value = true
    }
  }

  // 更新用户按钮的回调，row：已有用户的账号信息
  const updateUser = async (row: User) => {
    // 抽屉显示出来
    drawer.value = true
    // 存储收集已有的账号信息
    // userParams.value = { ...row }
    Object.assign(userParams.value, row)
    // 清空上一次的所有校验
    nextTick(() => {
      formRef.value.clearValidate()
    })
  }

  // 取消按钮的回调
  const cancel = () => {
    drawer.value = false
  }

  // 保存按钮的回调
  const save = async () => {
    // 点击保存按钮的时候，务必需要保证表单全部符合条件再去发请求
    await formRef.value.validate()
    // 保存按钮：添加新的用户|更新已有的用户账号信息
    // 抽屉显示出来
    const result = await reqAddOrUpdateUser(userParams.value)
    // 添加或者更新成功
    if (result.code === 200) {
      // 提示信息
      ElMessage.success(result.message)
      // 关闭抽屉
      drawer.value = false
      // 跳转到最后一页
      // pageNo.value = Math.ceil((total.value + 1) / pageSize.value)
      // 获取最新的全部账号信息
      // getHasUser(userParams.value.id? pageNo.value : 1)
      // 如果修改的是当前登录用户，需要重新登录
      if (result.data?.needRelogin) {
        // 清除本地存储的token
        localStorage.removeItem('token')
        // 跳转到登录页面
        window.location.href = '/login'
      } else {
        // 浏览器自动刷新一次
        window.location.reload()
      }
    } else {
      // 关闭抽屉
      drawer.value = false
      ElMessage.error(result.message)
    }
  }

  const confirmClick = async () => {
    const data: SetRoleData = {
      roleIdList: checkedRoles.value.map(item => {
        return item.id as number
      }),
      userId: userParams.value.id as number,
    }
    // 分配用户的职位
    const result: any = await reqSetUserRole(data)
    console.log(result)
    if (result.code === 200) {
      // 提示信息
      ElMessage.success(result.message)
      // 关闭抽屉
      drawer1.value = false
      // 获取更新完毕用户的信息，更新完毕留在当前页
      getHasUser(pageNo.value)
    }
  }
  // 组件挂载完毕
  onMounted(() => {
    getHasUser()
  })
</script>

<style scoped></style>
