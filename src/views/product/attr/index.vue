<template>
  <div class="flex flex-wrap gap-2">
    <Category :scene="scene" />
    <el-card style="width: 100%" shadow="always">
      <div v-show="scene === 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="!categoryStore.c3Id"
          @click="addAttr()"
          >添加属性</el-button
        >
        <el-table :data="attrArr" border style="margin: 10px 0">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="120px"></el-table-column>
          <el-table-column prop="attrValueList" label="属性值名称">
            <template #default="{ row }">
              <el-tag
                v-for="item in row.attrValueList"
                :key="item.id"
                type="success"
                style="margin: 5px"
                disable-transitions
                >{{ item.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130px">
            <!-- row:已有的属性对象 -->
            <template #default="{ row, $index }">
              <!-- 修改已有属性的按钮 -->
              <el-button type="primary" size="small" icon="Edit" @click="updateAttr(row, $index)" />
              <el-popconfirm
                :title="`确认删除${row.attrName}吗？`"
                width="200px"
                @confirm="deleteAttr(row.id)"
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
              style="width: 200px"
            />
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          :disabled="!attrParams.attrName"
          size="default"
          icon="Plus"
          @click="addAttrValue()"
          >添加属性值</el-button
        >
        <el-button @click="cancel()">取消</el-button>
        <el-table :data="attrParams.attrValueList" border style="margin: 10px 0">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性值">
            <!-- row即为当前属性值对象 -->
            <template #default="{ row, $index }">
              <!-- 编辑状态：input -->
              <el-input
                v-if="row.flag"
                size="small"
                v-model="row.valueName"
                :ref="(vc: any) => (inputArr[$index] = vc)"
                @blur="toLook(row, $index)"
                class="edit"
                placeholder="请输入属性值名称"
              />
              <div
                v-else
                class="view"
                @click="toEdit(row, $index)"
                style="background: linear-gradient(135deg, #ffeca3 0%, #f8bbd0 100%)"
              >
                {{ row.valueName || '请输入属性值名称' }}
              </div>
              <!-- <el-input placeholder="请输入属性值名称" v-model="row.valueName"></el-input> -->
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #default="{ row, $index }">
              <el-popconfirm
                :title="`确认删除${row.valueName}吗？`"
                width="200px"
                @confirm="deleteAttrValue($index)"
              >
                <template #reference>
                  <el-button type="danger" icon="Delete" />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          :disabled="!attrParams.attrName || !attrParams.attrValueList.length"
          type="primary"
          @click="save()"
          >保存</el-button
        >
        <el-button @click="cancel()">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
  // 获取分类的仓库
  import useCategoryStore from '@/store/modules/category'
  import { reqAttr, reqAddOrUpdateAttr, reqDeleteAttr } from '@/api/product/attr'
  import type { AttrResponseData, AttrList, Attr, AttrValue } from '@/api/product/attr/type'
  import { ElMessage } from 'element-plus'

  const categoryStore = useCategoryStore()
  // 存储已有的属性与属性值
  const attrArr = ref<AttrList>([])
  // 定义card组件内容切换变量
  const scene = ref<number>(0)

  const inputArr = ref<any>([])

  // 属性值表单元素失去焦点事件回调
  const toLook = (row: AttrValue, $index: number) => {
    // 非法情况判断1
    if (!row.valueName.trim()) {
      attrParams.attrValueList.splice($index, 1)
      // 提示信息
      ElMessage.error('属性值名称不能为空')
      return
    }
    // 非法情况判断2
    const isRepeat = attrParams.attrValueList.some(
      // 切记把当前失去焦点属性值对象从当前数组排除
      (item, index) => item.valueName.trim() === row.valueName.trim() && index !== $index
    )
    if (isRepeat) {
      // 将重复的属性值对象从当前数组中移除
      attrParams.attrValueList.splice($index, 1)
      // 提示信息
      ElMessage.error('属性值名称重复')
      return
    }
    // 相应的属性值对象flag: 变为false，展示div
    row.flag = false
  }

  // 属性值div点击事件回调
  const toEdit = (row: AttrValue, $index: number) => {
    // 相应的属性值对象flag: 变为true，展示input
    row.flag = true
    nextTick(() => {
      inputArr.value[$index].focus()
    })
  }

  // 收集新增的属性的数据
  const attrParams = reactive<Attr>({
    attrName: '', // 新增的属性的名字
    attrValueList: [], // 新增的属性值数组
    categoryId: '', // 三级分类的ID
    categoryLevel: 3, // 代表的是三级分类
  })

  // 监听仓库三级分类ID变化
  watch(
    () => categoryStore.c3Id,
    async () => {
      // 清空生一次查询的属性与属性值
      attrArr.value = []
      // 保证三级分类得有才能发请求
      if (!categoryStore.c3Id) return
      // 获取分类的id
      getAttr()
    }
  )

  // 获取已有的属性与属性值方法
  const getAttr = async () => {
    const { c1Id, c2Id, c3Id } = categoryStore
    // 获取分类下已有的属性与属性值
    const result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
    if (result.code === 200) {
      attrArr.value = result.data
    }
  }

  // 添加属性按钮的回调
  const addAttr = () => {
    Object.assign(attrParams, {
      attrName: '', // 新增的属性的名字
      attrValueList: [], // 新增的属性值数组
      // 点击这个按钮的时候手机新增属性的三级分类的id
      categoryId: categoryStore.c3Id, // 三级分类的ID
      categoryLevel: 3, // 代表的是三级分类
    })
    // 切换为添加与修改属性的结构
    scene.value = 1
  }

  // table表格修改已有属性按钮的回调
  const updateAttr = (row: Attr, $index: number) => {
    // 切换为添加与修改属性的结构
    scene.value = 1
    // ES6 -> Object.assign进行对象的合并(浅拷贝)，JSON.parse(JSON.stringify(row))用于深拷贝
    Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
  }

  // 取消按钮的回调
  const cancel = () => {
    scene.value = 0
  }

  // 添加属性值按钮的回调
  const addAttrValue = () => {
    attrParams.attrValueList.push({
      valueName: '',
      flag: true, // 控制每一个属性值编辑模式与查看模式的切换
    })
    nextTick(() => {
      inputArr.value[attrParams.attrValueList.length - 1].focus()
    })
  }

  // 保存按钮的回调
  const save = async () => {
    // 发请求
    const result: any = await reqAddOrUpdateAttr(attrParams)
    // 添加|修改已有的属性成功
    if (result.code === 200) {
      // 提示信息
      ElMessage.success(attrParams.id ? '修改成功' : '添加成功')
      // 切换场景
      scene.value = 0
      // 获取全部已有的属性与属性值
      getAttr()
    } else {
      ElMessage.error(attrParams.id ? '修改失败' : '添加失败')
    }
  }

  // 删除已有属性按钮的回调
  const deleteAttr = async (attrId: number) => {
    // 发相应的删除已有属性的请求
    const result: any = await reqDeleteAttr(attrId)
    if (result.code === 200) {
      ElMessage.success('删除成功')
      getAttr()
    } else {
      ElMessage.error('删除失败')
    }
  }

  // 删除属性值按钮的回调
  const deleteAttrValue = ($index: number) => {
    // ✅ 只删除当前点击的这一行（根据索引删除）
    attrParams.attrValueList.splice($index, 1)
  }

  // 组件卸载前的清理工作
  onBeforeUnmount(() => {
    // 清空仓库的数据
    categoryStore.$reset()
  })
</script>

<style scoped></style>
