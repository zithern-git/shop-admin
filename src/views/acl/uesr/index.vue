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
              <el-button type="primary" size="small" icon="User">分配角色</el-button>
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
    <el-drawer v-model="drawer" :title="showPassword ? '添加用户' : '修改用户'">
      <el-form>
        <el-form-item label="用户姓名"
          ><el-input v-model="userParams.username" placeholder="请填写用户名字"
        /></el-form-item>
        <el-form-item label="用户昵称"
          ><el-input v-model="userParams.name" placeholder="请填写用户昵称"
        /></el-form-item>
        <el-form-item label="用户密码" v-show="showPassword"
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
  </el-card>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { reqUserInfo, reqAddOrUpdateUser } from '@/api/acl/user'
  import type { UserResponseData, Records, User } from '@/api/acl/user/type'
  import { ElMessage } from 'element-plus'

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
  const showPassword = ref<boolean>(true)
  // 收集用户信息的响应式数据
  const userParams = ref<User>({
    name: '',
    password: '',
    username: '',
  })

  // 获取全部已有的用户信息
  const getHasUser = async (pager = 1) => {
    // pageNo.value = pager
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
    showPassword.value = true
    Object.assign(userParams.value, {
      name: '',
      password: '',
      username: '',
    })
  }

  // 更新用户按钮的回调，row：已有用户的账号信息
  const updateUser = async (row: User) => {
    // 抽屉显示出来
    drawer.value = true
    showPassword.value = false
    userParams.value = { ...row }
  }

  // 取消按钮的回调
  const cancel = () => {
    drawer.value = false
  }

  // 保存按钮的回调
  const save = async () => {
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
      pageNo.value = Math.ceil(total.value / pageSize.value)
      // 获取最新的全部账号信息
      getHasUser()
    } else {
      // 关闭抽屉
      drawer.value = false
      ElMessage.error(result.message)
    }
  }

  // 组件挂载完毕
  onMounted(() => {
    getHasUser()
  })
</script>

<style scoped></style>
