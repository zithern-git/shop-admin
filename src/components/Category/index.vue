<template>
  <el-card style="width: 100%" shadow="always">
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <!-- change选中值发生变化时触发 -->
        <el-select
          v-model="categoryStore.c1Id"
          :disabled="scene !== 0"
          placeholder="请选择"
          style="width: 200px"
          @change="handleC1Change">
          <!-- option:label即为展示数据，value即为select下拉菜单收集的数据 -->
          <el-option
            v-for="c1 in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="categoryStore.c2Id"
          :disabled="scene !== 0"
          placeholder="请选择"
          style="width: 200px"
          @change="handleC2Change">
          <el-option
            v-for="c2 in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="categoryStore.c3Id"
          :disabled="scene !== 0"
          placeholder="请选择"
          style="width: 200px">
          <el-option
            v-for="c3 in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
            >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
// 引入组件挂载完毕方法
import { onMounted } from 'vue'
// 引入分类相关的仓库
import useCategoryStore from '@/store/modules/category'

const categoryStore  = useCategoryStore()
// 分类全局组件挂载完毕，通知仓库发请求获取一级分类的数据
onMounted(() => {
  getC1()
})

// 通知仓库获取一级分类的数据
const getC1 = () => {
  // 通知分类仓库发请求获取一级分类的数据
  categoryStore.getC1()
}

// 此方法即为一级分类的下拉菜单的change事件（选中值得时候会触发，保证一级分类id有了）
const handleC1Change = () => {
  // 需要清空二级、三级分类的数据
  categoryStore.c2Id = ''
  categoryStore.c3Id = ''
  // 这里就可以调用接口 → 获取二级分类
  categoryStore.getC2()
}

// 此方法即为二级分类的下拉菜单的change事件（选中值得时候会触发，保证二级分类id有了）
const handleC2Change = () => {
  // 需要清空三级分类的数据
  categoryStore.c3Id = ''
  // 这里就可以调用接口 → 获取三级分类
  categoryStore.getC3()
}

defineProps(['scene'])

</script>

<style scoped></style>
