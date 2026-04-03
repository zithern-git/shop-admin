<template>
  <div class="flex flex-wrap gap-2">
    <Category />
    <el-card style="width: 100%" shadow="always">
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        :disabled="!categoryStore.c3Id">添加属性</el-button>
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
            <el-button type="primary" size="small" icon="Edit"/>
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
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
// 获取分类的仓库
import useCategoryStore from '@/store/modules/category';
import { reqAttr } from '@/api/product/attr';
import type { AttrResponseData, AttrList } from '@/api/product/attr/type';

const categoryStore = useCategoryStore();
// 存储已有的属性与属性值
const attrArr = ref<AttrList>([])

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
</script>

<style scoped></style>
