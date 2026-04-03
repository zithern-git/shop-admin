<template>
  <div class="flex flex-wrap gap-2">
    <Category :scene="scene"/>
    <el-card style="width: 100%" shadow="always">
      <div v-show="scene === 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="!categoryStore.c3Id"
          @click="addAttr()">添加属性</el-button>
        <el-table :data="attrArr" border style="margin: 10px 0">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="120px"></el-table-column>
          <el-table-column
            prop="attrValueList"
            label="属性值名称">
            <template #default="{row}">
              <el-tag
                v-for="item in row.attrValueList"
                :key="item.id"
                type="success"
                style="margin: 5px;"
                disable-transitions
                >{{ item.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130px">
            <template #default="{ row }">
              <el-button type="primary" size="small" icon="Edit" @click="updateAttr()"/>
              <el-popconfirm
                :title="`确认删除${row.attrName}吗？`"
                width="200px"
              >
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete" />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene === 1">
        <!-- 展示添加与修改属性结构 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
            v-model="attrParams.attrName"
              placeholder="请输入属性的名字"
              style="width: 200px;"/>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          >添加属性值</el-button>
        <el-button @click="cancel()">取消</el-button>
        <el-table border style="margin: 10px 0">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性值"></el-table-column>
          <el-table-column label="操作" width="120px"></el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="cancel()">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, reactive } from 'vue'
// 获取分类的仓库
import useCategoryStore from '@/store/modules/category';
import { reqAttr } from '@/api/product/attr';
import type { AttrResponseData, AttrList, Attr } from '@/api/product/attr/type';

const categoryStore = useCategoryStore();
// 存储已有的属性与属性值
const attrArr = ref<AttrList>([])
// 定义card组件内容切换变量
const scene = ref<number>(0)

// 收集新增的属性的数据
const attrParams = reactive<Attr>({
  attrName: "", // 新增的属性的名字
  attrValueList: [], // 新增的属性值数组
  categoryId: "", // 三级分类的ID
  categoryLevel: 3 // 代表的是三级分类
})

// 监听仓库三级分类ID变化
watch(() => categoryStore.c3Id, async () => {
  // 清空生一次查询的属性与属性值
  attrArr.value = []
  // 保证三级分类得有才能发请求
  if (!categoryStore.c3Id) return;
  // 获取分类的id
  getAttr()
})

// 获取已有的属性与属性值方法
const getAttr = async () => {
  const {c1Id, c2Id, c3Id} = categoryStore
  // 获取分类下已有的属性与属性值
  const result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
    if (result.code === 200) {
      attrArr.value = result.data;
    }
  }

  // 添加属性按钮的回调
  const addAttr = () => {
    // 切换为添加与修改属性的结构
    scene.value = 1
  }

  // table表格修改已有属性按钮的回调
  const updateAttr = () => {
    // 切换为添加与修改属性的结构
    scene.value = 1
  }

  // 取消按钮的回调
  const cancel = () => {
    scene.value = 0
  }

</script>

<style scoped></style>
