<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请输入SPU名称" v-model="spuParams.spuName" />
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select placeholder="请选择品牌" style="width: 200px" v-model="spuParams.tmId">
        <el-option
          v-for="item in AllTrademark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input placeholder="请输入描述" type="textarea" v-model="spuParams.description" />
    </el-form-item>
    <el-form-item label="SPU照片">
      <!-- v-model:file-list用于展示默认图片
           action：上传图片的接口地址
           list-type：文件列表的类型（'text' | 'picture' | 'picture-card'）
           on-preview：点击文件列表中已上传的文件时的钩子
           on-remove：文件列表移除文件时的钩子
           before-upload: 上传文件之前的钩子，参数为上传的文件， 若返回false或者返回 Promise 且被 reject，则停止上传。
      -->
      <el-upload
        v-model:file-list="imageList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="beforeAvatarUpload"
        :headers="uploadHeaders"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select
        v-model="saleAttrIdAndValueName"
        :placeholder="
          unselectedSaleAttr.length ? `还有${unselectedSaleAttr.length}个选择` : '暂无数据'
        "
        style="width: 200px; margin-right: 10px"
      >
        <el-option
          v-for="item in unselectedSaleAttr"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        />
      </el-select>
      <el-button type="primary" icon="Plus" :disabled="!saleAttrIdAndValueName" @click="addSaleAttr"
        >添加销售属性</el-button
      >
      <!-- table：展示销售属性与属性值 -->
      <el-table :data="saleAttr" border style="margin: 10px 0">
        <el-table-column type="index" label="序号" align="center" width="80px"></el-table-column>
        <el-table-column prop="saleAttrName" label="属性名" width="120px"></el-table-column>
        <el-table-column label="属性值">
          <!-- row：当前SPU已有的销售属性对象 -->
          <template #default="{ row, $index }">
            <el-tag
              style="margin: 0 5px"
              type="primary"
              v-for="(item, index) in row.spuSaleAttrValueList"
              closable
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              :key="item.id"
              >{{ item.saleAttrValueName }}</el-tag
            >
            <el-input
              v-model="row.saleAttrValue"
              v-if="row.flag"
              size="small"
              style="width: 100px"
              @blur="toLook(row)"
              placeholder="请输入内容"
            />
            <el-button type="success" v-else icon="Plus" size="small" @click="toEdit(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="120px">
          <template #default="{ row, $index }">
            <el-popconfirm :title="`确认删除${row.tmName}吗？`" width="200px">
              <template #reference>
                <el-button type="danger" icon="Delete" @click="saleAttr.splice($index, 1)" />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save" :disabled="!saleAttr.length">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { UploadProps } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import {
    reqAllTrademark,
    reqSpuImageList,
    reqSpuHasSaleAttr,
    reqAllSaleAttr,
    reqAddOrUpdateSpu,
  } from '@/api/product/spu'
  import type {
    HasSaleAttr,
    SpuImageList,
    SpuSaleAttrListResponseData,
    SpuImage,
    SpuSaleAttr,
    HasSaleAttrResponseData,
    AllTrademark,
    SpuData,
    SpuSaleAttrValue,
  } from '@/api/product/spu/type'
  import type { Trademark } from '@/api/product/trademark/type'
  import { GET_TOKEN } from '@/utils/token'

  // 声明要触发的事件名
  const $emit = defineEmits(['changeScene'])

  const saleAttrIdAndValueName = ref<string>('')

  // 存储已有的SPU这些数据
  const AllTrademark = ref<Trademark[]>([])
  // 商品图片
  const imageList = ref<SpuImage[]>([])
  // 已有的SPU销售属性
  const saleAttr = ref<SpuSaleAttr[]>([])
  // 全部销售属性
  const allSaleAttr = ref<HasSaleAttr[]>([])
  // 存储
  const spuParams = ref<SpuData>({
    spuName: '',
    description: '',
    category3Id: '',
    tmId: '', // 品牌id
    spuImageList: [],
    spuSaleAttrList: [],
  })

  // ✅【核心】上传请求头：自动携带 TOKEN
  const uploadHeaders = ref({
    token: GET_TOKEN(), // 完全匹配后端格式
  })

  const initHasSpuData = async (spu: SpuData) => {
    // spu：父组件传过来的已有的SPU对象[不完整]
    spuParams.value = spu
    try {
      // 获取全部品牌的数据
      const result: AllTrademark = await reqAllTrademark()

      // 获取某一个品牌旗下的全部售卖商品图片
      const result1: SpuImageList = await reqSpuImageList(spu.id as number)

      // 获取已有的SPU销售属性的数据
      const result2: SpuSaleAttrListResponseData = await reqSpuHasSaleAttr(spu.id as number)

      // 获取整个项目全部SPU的销售属性
      const result3: HasSaleAttrResponseData = await reqAllSaleAttr()

      // 存储全部品牌的数据
      AllTrademark.value = result.data
      // SPU对应商品图片
      const imgData = result1.data
      imageList.value = (Array.isArray(imgData) ? imgData : []).map(item => ({
        name: item.imgName as string,
        url: item.imgUrl,
      }))
      // 存储已有的SPU的销售属性
      saleAttr.value = Array.isArray(result2.data) ? result2.data : []
      // 存储全部的销售属性
      allSaleAttr.value = result3.data
    } catch (error) {
      console.error('initHasSpuData 出错:', error)
    }
  }

  // 存储预览图片地址
  const dialogImageUrl = ref('')
  // 控制对话框的显示与隐藏
  const dialogVisible = ref(false)

  // 照片墙点击预览按钮时触发的钩子
  const handlePictureCardPreview: UploadProps['onPreview'] = uploadFile => {
    dialogImageUrl.value = uploadFile.url!
    // 对话框弹出来
    dialogVisible.value = true
  }

  // 上传文件之前的钩子，参数为上传的文件， 约束文件的大小与类型
  const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
      ElMessage.error('Avatar picture must be JPG/PNG format!')
      return false
    } else if (rawFile.size / 1024 / 1024 > 5) {
      ElMessage.error('Avatar picture size can not exceed 5MB!')
      return false
    }
    return true
  }

  // 照片墙删除文件钩子
  const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    console.log(uploadFile, uploadFiles)
  }

  const unselectedSaleAttr = computed(() => {
    // 全部销售属性：颜色、版本、套餐、尺码
    // return allSaleAttr.value.filter(item1 => {
    //   return saleAttr.value.every(item2 => item2.saleAttrName !== item1.name)
    // })
    return allSaleAttr.value.filter(item1 => {
      return !saleAttr.value.some(item2 => item2.saleAttrName === item1.name)
    })
  })

  // 添加销售属性方法
  const addSaleAttr = () => {
    const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
    /*
    baseSaleAttrId?: number
    saleAttrName?: string
    saleAttrValueList: SpuSaleAttrValue[]
    */
    // 准备一个新的销售属性对象：将来带给服务器即可
    const newSaleAttr: SpuSaleAttr = {
      baseSaleAttrId: baseSaleAttrId!,
      saleAttrName: saleAttrName!,
      spuSaleAttrValueList: [],
    }
    // 追加到数组当中
    saleAttr.value.push(newSaleAttr)
    // 清空收集的数据
    saleAttrIdAndValueName.value = ''
  }

  // 属性值按钮的点击事件
  const toEdit = (row: SpuSaleAttr) => {
    // 点击按钮的时候，input组件显示->编辑模式
    row.flag = true
    row.saleAttrValue = ''
  }

  // 表单元素失去焦点的事件回调：隐藏输入框，显示按钮
  const toLook = (row: SpuSaleAttr) => {
    // 整理收集的属性的ID与属性值的名字
    const { baseSaleAttrId, saleAttrValue } = row
    // 整理成服务器需要的属性值的形式
    const newSaleAttrValue: SpuSaleAttrValue = {
      baseSaleAttrId,
      saleAttrValueName: saleAttrValue,
    }
    // 非法情况判断
    if (!(saleAttrValue as string).trim()) {
      ElMessage.error('属性值不能为空')
      return
    }
    // 判断属性值是否在数组中存在
    const repeat = row.spuSaleAttrValueList.find(item => item.saleAttrValueName === saleAttrValue)
    if (repeat) {
      ElMessage.error('属性值不能重复')
      return
    }
    // 追加新的属性值对象
    row.spuSaleAttrValueList.push(newSaleAttrValue)
    // 切换为查看模式
    row.flag = false
  }

  // 保存按钮的回调
  const save = async () => {
    // 整理参数
    // 发请求：添加SPU|更新已有的SPU
    // 1：照片墙的数据
    spuParams.value.spuImageList = imageList.value.map(item => ({
      imgName: item.name, // 图片的名字
      imgUrl: (item.response && item.response.data) || item.url, // 图片的url
    }))
    // 2：整理销售属性的数据
    spuParams.value.spuSaleAttrList = saleAttr.value
    const result = await reqAddOrUpdateSpu(spuParams.value)
    if (result.code === 200) {
      // 成功
      ElMessage.success(spuParams.value.id ? '更新成功' : '添加成功')
      // 通知父组件切换场景为0
      $emit('changeScene', { flag: 0, params: spuParams.value.id ? 'update' : 'add' })
    } else {
      // 失败
      ElMessage.error(spuParams.value.id ? '更新失败' : '添加失败')
    }
  }

  // 点击取消按钮：通知父组件切换场景为0，展示已有的SPU数据
  const cancel = () => {
    // 关键：emit(事件名, 要传的值)
    $emit('changeScene', { flag: 0, params: 'update' })
  }

  // 添加一个新的SPU初始化请求方法
  const initAddSpu = async (c3Id: number | string) => {
    // 清空数据
    Object.assign(spuParams.value, {
      spuName: '',
      description: '',
      category3Id: '',
      tmId: '', // 品牌id
      spuImageList: [],
      spuSaleAttrList: [],
    })
    // 清空照片
    imageList.value = []
    // 清空销售属性
    saleAttr.value = []
    saleAttrIdAndValueName.value = ''
    // 存储三级分类的id，后端数据不足，只有category3Id==61的数据
    // spuParams.value.category3Id = c3Id
    spuParams.value.category3Id = 61
    // 获取全部品牌的数据
    const result: AllTrademark = await reqAllTrademark()

    // 获取整个项目全部SPU的销售属性
    const result1: HasSaleAttrResponseData = await reqAllSaleAttr()

    // 存储全部品牌的数据
    AllTrademark.value = result.data
    // 存储全部的销售属性
    allSaleAttr.value = result1.data
  }
  // 对外暴露
  defineExpose({ initHasSpuData, initAddSpu })
</script>

<style scoped></style>
