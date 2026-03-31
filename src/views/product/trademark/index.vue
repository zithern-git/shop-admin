<template>
  <!-- 卡片顶部添加品牌按钮 -->
  <el-card>
    <el-button type="primary" @click="dialogFormVisible = true"
      ><el-icon><Plus /></el-icon> 添加品牌</el-button
    >
    <el-dialog v-model="dialogFormVisible" title="添加品牌" width="500">
      <el-form :model="trademarkForm">
        <el-form-item label="品牌名称" :label-width="formLabelWidth" required>
          <el-input placeholder="请输入品牌名称" v-model="trademarkForm.tmName" />
        </el-form-item>
        <el-form-item label="品牌LOGO" :label-width="formLabelWidth" required>
          <!-- upload组件属性 -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽：footer -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 表格组件：用于展示已有品牌的数据 -->
    <!--
      table
      ---border：可以设置表格纵向是否有边框
      table-column
      ---width:对应列的宽度
      ---align:对齐方式
     -->
    <el-table :data="trademarkArr" border style="width: 100%; margin: 10px 0">
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column prop="tmName" label="品牌名称" />
      <!-- el-table-column 默认展示数据用div -->
      <el-table-column label="品牌Logo">
        <template #default="{ row }">
          <img
            :src="row.logoUrl"
            alt="未有图片"
            style="width: 50px; height: 50px; object-fit: cover"
          />
        </template>
      </el-table-column>
      <el-table-column prop="option" label="品牌操作">
        <template #default="{ row, $index }">
          <el-button type="primary" icon="Edit" @click="dialogFormVisible = true" />
          <el-button type="danger" icon="Delete" @click="dialogFormVisible = true" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器组件
      pagination
        v-model:current-page：设置当前页数
        v-model:page-size: 每页显示条目个数
        page-sizes：每页显示个数选择器的选项设置
        background:是否为分页按钮添加背景色
        layout:可以设置分页器6个子组件布局调整，子组件名用逗号分隔
    -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :size="size"
      :disabled="disabled"
      :background="background"
      layout=" prev, pager, next, jumper, ->, sizes, total "
      :total="total"
    />
  </el-card>
</template>

<script setup lang="ts">
  // 引入组合式API函数ref
  import { ref, onMounted, watch, reactive } from 'vue'
  import type { ComponentSize } from 'element-plus'
  import { reqHasTrademark, reqAddOrUpdateTrademark } from '@/api/product/trademark'
  import type { Records, TrademarkResponseData, Trademark } from '@/api/product/trademark/type'
  import { ElMessage } from 'element-plus'
  import { Plus } from '@element-plus/icons-vue'

  import type { UploadProps } from 'element-plus'

  const imageUrl = ref('')

  const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  }

  const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
    if (rawFile.type !== 'image/jpeg') {
      ElMessage.error('Avatar picture must be JPG format!')
      return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
      ElMessage.error('Avatar picture size can not exceed 2MB!')
      return false
    }
    return true
  }
  // 当前页码
  const pageNo = ref<number>(1)
  // 每一页展示多少条数据
  const limit = ref<number>(3)
  const size = ref<ComponentSize>('default')
  const background = ref(true)
  const disabled = ref(false)
  // 存储已有品牌数据总数
  const total = ref<number>(0)
  const trademarkArr = ref<Records>([])
  // 获取已有品牌的接口封装为一个函数：在任何情况下获取数据，调用函数即可
  const getHasTrademark = async () => {
    // pageNo.value = pager;
    const result: TrademarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
    if (result.code === 200) {
      // 存储已有品牌的总数
      total.value = result.data.total
      trademarkArr.value = result.data.records
    }
  }

  const dialogFormVisible = ref(false)
  const formLabelWidth = '100px'
  // 定义收集品牌表单数据
  const trademarkForm = reactive<Trademark>({
    tmName: '',
    logoUrl: '',
  })

  // 添加或修改品牌的接口封装为一个函数：在任何情况下添加或修改品牌，调用函数即可
  const addOrUpdateTrademark = async () => {
    const result = await reqAddOrUpdateTrademark(trademarkForm)
    if (result.code === 200) {
      ElMessage.success('添加品牌成功')
      dialogFormVisible.value = false
      getHasTrademark()
    }
  }

  // 组件挂载完毕钩子————发一次请求，获取第一页，一页三个已有品牌数据
  onMounted(() => {
    getHasTrademark()
  })

  // 监听 limit 变化 → 切回第1页
  watch(limit, () => {
    pageNo.value = 1 // ✅ 切换每页条数时，强制回到第1页
  })

  watch(
    [pageNo, limit], // 监听两个变量
    () => {
      getHasTrademark() // 只要变了，就重新请求数据
    },
    { immediate: false }
  )
</script>

<style scoped>
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

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
