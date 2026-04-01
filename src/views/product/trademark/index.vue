<template>
  <!-- 卡片顶部添加品牌按钮 -->
  <el-card>
    <el-button type="primary" @click="addTrademark"
      ><el-icon><Plus /></el-icon> 添加品牌</el-button
    >
    <el-dialog v-model="dialogFormVisible" :title="trademarkForm.id? '修改品牌': '添加品牌'" width="500">
      <el-form
        ref="formRef"
        :model="trademarkForm"
        :rules="rules">
        <el-form-item label="品牌名称" :label-width="formLabelWidth" prop="tmName">
          <el-input placeholder="请输入品牌名称" v-model="trademarkForm.tmName" />
        </el-form-item>
        <el-form-item label="品牌LOGO" :label-width="formLabelWidth" prop="logoUrl">
          <!-- upload组件属性 -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :headers="uploadHeaders"
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
          <el-button type="primary" @click="confirm()"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 警告提示框 -->
    <el-dialog
      v-model="dialogVisible"
      title="Warning"
      width="500"
      center
    >
      <span>确认删除品牌吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmDelete()">
            确认
          </el-button>
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
        <!-- row → 当前行数据
            column → 当前列配置
            $index → 当前行下标
        -->
        <template #default="{ row, $index }">
          <el-button type="primary" icon="Edit" @click="updateTrademark(row)" />
          <el-button type="danger" icon="Delete" @click="deleteTrademark(row)" />
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
  import { ref, onMounted, watch, reactive, nextTick } from 'vue'
  import type { ComponentSize } from 'element-plus'
  import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark'
  import type { Records, TrademarkResponseData, Trademark } from '@/api/product/trademark/type'
  import { ElMessage } from 'element-plus'
  import { Plus } from '@element-plus/icons-vue'

  import type { UploadProps } from 'element-plus'
  import useUserStore from '@/store/modules/user'

  const userStore = useUserStore()
  const imageUrl = ref('')
  const currentDeleteRow = ref<Trademark | null>(null)
  // 获取el-form组件实例
  const formRef = ref()

  // 上传请求头 - 携带token
  const uploadHeaders = {
    token: userStore.token,
  }

  // 上传图片组件，上传图片之前触发的钩子
  const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
    // 1. 定义支持的图片格式（MIME类型）
    const allowedTypes = [
      'image/jpeg',  // jpg/jpeg 格式
      'image/png',   // png 格式
      'image/webp',  // webp 格式（可选，可自行增删）
      'image/gif'    // gif 格式（可选）
    ];
    // 2. 判断文件格式是否在允许列表中
    if (!allowedTypes.includes(rawFile.type)) {
      ElMessage.error('头像图片仅支持 JPG、PNG、WebP、GIF 格式！');
      return false;
    }
    // 3. 判断文件大小不超过4MB
    else if (rawFile.size / 1024 / 1024 > 4) {
      ElMessage.error('头像图片大小不能超过 4MB！');
      return false;
    }
    return true;
};

  // 图片上传成功钩子
  const handleAvatarSuccess: UploadProps['onSuccess'] = response => {
    if (response.code === 200) {
      imageUrl.value = response.data
      trademarkForm.logoUrl = response.data
      // 图片上传成功，清除掉对应图片校验结果
      formRef.value.clearValidate()
    } else {
      ElMessage.error(response.message || '上传失败')
    }
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
  const dialogVisible = ref(false)
  const formLabelWidth = '100px'

  // 定义收集品牌表单数据
  const trademarkForm = reactive<Trademark>({
    tmName: '',
    logoUrl: '',
  })

  // 品牌名称的自定义校验规则
  const validateTmName = (rule: any, value: any, callback: any) => {
    // 自定义校验规则
    if (value.trim().length >= 2) {
      callback()
    } else {
      callback(new Error('品牌名称位数需大于等于两位'))
    }
  }

  // 品牌LOGO图片的自定义校验规则
  const validateLogoUrl = (rule: any, value: any, callback: any) => {
    // 关键：校验 imageUrl 是否为空
    if (!value) {
      callback(new Error('请上传品牌LOGO'))
    } else {
      callback()
    }
  }

  // 表单校验规则对象
  const rules = reactive({
    tmName: [
      // required：这个字段务必校验，表单项前面出来五角星
      // trigger：代表触发校验规则时机[blur/change]
      { required: true,
        trigger: 'blur',
        validator: validateTmName,
       }
    ],
    logoUrl: [
      { required: true,
        trigger: 'change',
        validator: validateLogoUrl,

      }],
  })

  // 点击添加按钮：清空表单 + 打开弹窗
  const addTrademark = () => {
    dialogFormVisible.value = true
    // 清空表单（重要！）
    trademarkForm.id = undefined // //这里不能写0
    trademarkForm.tmName = ''
    trademarkForm.logoUrl = ''
    imageUrl.value = ''
    // 第一种写法：ts的?
    // formRef.value?.clearValidate()
    // 第二种写法：nextTick()
    nextTick(() => {
      formRef.value.clearValidate()
    })
  }

    // 修改已有品牌数据
  const updateTrademark = async (row: Trademark) => {
    // 对话框显示
    dialogFormVisible.value = true
    // 展示已有品牌的数据
    Object.assign(trademarkForm, row); //与下面三行等效
    // trademarkForm.id = row.id;
    // trademarkForm.tmName = row.tmName;
    // trademarkForm.logoUrl = row.logoUrl;
    imageUrl.value = row.logoUrl;
    formRef.value.clearValidate()
  }

  // 添加品牌的接口封装为一个函数：在任何情况下添加品牌，调用函数即可
  const confirm = async () => {
    // 调用这个方法进行全部表单校验，如果校验全部通过，再执行后面的语法
    await formRef.value.validate();
    // 发请求（接口自动判断：有id修改，无id新增）
    const result = await reqAddOrUpdateTrademark(trademarkForm)
    // 添加|修改品牌
    if (result.code === 200) {
      // 判断提示文字
      if (trademarkForm.id) {
        ElMessage.success('修改品牌成功')
      } else {
        ElMessage.success('添加品牌成功')
      }
      dialogFormVisible.value = false // 关闭弹窗
      getHasTrademark() // 刷新列表
    } else {
      ElMessage.error('操作失败')
    }
  }

  // 删除已有品牌数据
  const deleteTrademark = (row: Trademark) => {
    currentDeleteRow.value = row  // 把当前行存起来
    dialogVisible.value = true
  }

  const confirmDelete = async () => {
    // 从存储的变量里拿
    const row = currentDeleteRow.value
    // 安全判断
    if (!row?.id) return;
    const result = await reqDeleteTrademark(row.id) as any;
    if (result.code === 200) {
      ElMessage.success('删除品牌成功')
      dialogVisible.value = false
      getHasTrademark()
    } else {
      ElMessage.error('删除品牌失败')
      dialogVisible.value = false
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

  watch(dialogFormVisible, nVal => {
    if (!nVal) {
      // 当对话框关闭时，清空表单数据
      trademarkForm.tmName = ''
      trademarkForm.logoUrl = ''
      imageUrl.value = ''
    }
  })
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
