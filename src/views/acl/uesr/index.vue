<template>
  <el-card style="margin-bottom: 20px; ">
    <div style="display: flex; justify-content: space-between;align-items: center;">
      <div>
        <span>用户名：</span>
        <el-input placeholder="请输入用户名" style="width: 200px"/>
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
        <el-button type="primary">添加</el-button>
        <el-button type="danger">批量删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-table border>
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column label="#" type="index" align="center"></el-table-column>
          <el-table-column label="id" align="center"></el-table-column>
          <el-table-column label="用户名字" align="center"></el-table-column>
          <el-table-column label="用户名称" align="center"></el-table-column>
          <el-table-column label="用户角色" align="center"></el-table-column>
          <el-table-column label="创建时间" align="center"></el-table-column>
          <el-table-column label="更新时间" align="center"></el-table-column>
          <el-table-column label="操作" width="260px" align="center">
            <template #default>
              <el-button type="primary"><el-icon><User /></el-icon>分配角色</el-button>
              <el-button type="primary"><el-icon><Edit /></el-icon>编辑</el-button>
              <el-button type="primary"><el-icon><Delete /></el-icon>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 分页器 -->
      <el-form-item>
        <div style="width: 100%; text-align: right; margin-top: 15px;">
          <el-pagination
            v-model:current-page="pageNo"
            v-model:page-size="pageSize"
            :page-sizes="[5, 7, 9, 11]"
            :background="true"
            layout="prev,pager,next,jumper,->,sizes,total"
            :total="20"
            @size-change="getHasUser"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang='ts'>
import {ref, onMounted} from 'vue'

// 默认页码
const pageNo = ref<number>(1)
// 一页展示几条数据
const pageSize = ref<number>(5)

const getHasUser = () => {
  console.log(123)
}

const handleCurrentChange = () => {
  console.log(456)
}

onMounted(() => {
  getHasUser()
})
</script>

<style scoped>
</style>
