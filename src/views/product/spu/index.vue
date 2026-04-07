<template>
  <div class="flex flex-wrap gap-2">
    <Category :scene="scene" />
    <el-card style="width: 100%" shadow="always">
      <div v-show="scene === 0">
        <el-button type="primary" size="default" icon="Plus" :disabled="!categoryStore.c3Id"
          >添加属性</el-button
        >
        <!-- 展示已有SPU数据 -->
        <el-table :data="records" border style="margin: 10px 0">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="120px"></el-table-column>
          <el-table-column prop="description" label="SPU描述" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="240px">
            <!-- row:已有的属性对象 -->
            <template #default="{ row, $index }">
              <el-button type="primary" size="small" icon="Plus" title="添加SKU"/>
              <!-- 修改已有属性的按钮 -->
              <el-button type="warning" style="background:#ff9f00;color:#fff" size="small" icon="Edit" title="修改SPU" />
              <el-button type="info" style="background:#909399;color:#fff" size="small" icon="InfoFilled" title="查看SPU" />
              <el-popconfirm :title="`确认删除${row.attrName}吗？`" width="200px">
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete" title="删除SPU" />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[1, 3, 5, 7]"
          :background="true"
          layout="prev,pager,next,jumper,->, sizes, total"
          :total="total"
        />
      </div>
      <div v-show="scene === 1">
        <el-form>
          <el-form-item label="SPU名称">
            <el-input placeholder="请输入SPU名称" />
          </el-form-item>
          <el-form-item label="SPU品牌">
            <el-select placeholder="请选择品牌" style="width: 200px">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="SPU描述">
            <el-input placeholder="请输入描述" type="textarea" />
          </el-form-item>
          <el-form-item label="SPU照片">
            <el-upload
              class="avatar-uploader"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              :show-file-list="false"
            >
              <!-- <img class="avatar" /> -->
              <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="SPU销售属性">
            <el-select placeholder="还有3位选择" style="width: 200px; margin: 0 10px 0 0">
              <el-option label="Zone 3" value="gz" />
              <el-option label="Zone 4" value="sz" />
            </el-select>
            <el-button type="primary" icon="Plus">添加销售属性</el-button>
            <el-table border style="margin: 10px 0">
              <el-table-column label="序号" align="center"></el-table-column>
              <el-table-column label="属性名"></el-table-column>
              <el-table-column label="属性值"></el-table-column>
              <el-table-column label="操作"></el-table-column>
            </el-table>
            <el-button type="primary">保存</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  // 引入分类的仓库
  import useCategoryStore from '@/store/modules/category'
  import { reqHasSpu } from '@/api/product/spu'
  import type { Records, HasSpuResponseData } from '@/api/product/spu/type'

  // 场景切换和分类存储
  const scene = ref<number>(0)
  const categoryStore = useCategoryStore()
  // 分页器默认页码
  const pageNo = ref<number>(1)
  // 每一页展示几条数据
  const pageSize = ref<number>(3)
    // 存储已有SPU总数
  const total = ref<number>(0)
  const records = ref<Records>([])

  // 此方法执行：可以获取某一个三级分类下全部已有的SPU
  const getHasSPU = async () => {
    // const result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id);
    const result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, 61);
    if (result.code === 200) {
      records.value = result.data.records;
      total.value = result.data.total;
    }
  }

  // 监听三级分类ID变化
  watch(
    () => categoryStore.c3Id,
    () => {
      if (categoryStore.c3Id) {
        getHasSPU()
      }
    }
  )

  // 监听分页变化 → 自动请求
  watch([pageNo, pageSize], () => {
    getHasSPU()
  })

</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
</style>
