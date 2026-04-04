<template>
  <div class="flex flex-wrap gap-2">
    <Category :scene="scene" />
    <el-card style="width: 100%" shadow="always">
      <div v-show="scene === 0">
        <el-button type="primary" size="default" icon="Plus" :disabled="!categoryStore.c3Id"
          >添加属性</el-button
        >
        <el-table border style="margin: 10px 0">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column prop="attrName" label="SPU名称" width="120px"></el-table-column>
          <el-table-column prop="attrValueList" label="SPU描述">
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
              <el-button type="primary" size="small" icon="Plus" />
              <!-- 修改已有属性的按钮 -->
              <el-button type="warning" size="small" icon="Edit" />
              <el-button type="info" size="small" icon="InfoFilled" />
              <el-popconfirm :title="`确认删除${row.attrName}吗？`" width="200px">
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete" />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev,pager,next,jumper,->, sizes, total"
          :total="400"
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
  import { ref } from 'vue'
  import useCategoryStore from '@/store/modules/category'

  // 场景切换和分类存储
  const scene = ref<number>(0)
  const categoryStore = useCategoryStore()
  // 分页器默认页码
  const pageNo = ref<number>(1)
  // 每一页展示几条数据
  const pageSize = ref<number>(3)
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
