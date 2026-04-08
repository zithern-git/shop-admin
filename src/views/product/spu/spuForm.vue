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
      <el-upload
        v-model:file-list="spuParams.spuImageList"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select placeholder="还有3位选择" style="width: 200px; margin-right: 10px">
        <el-option
          v-for="item in spuParams.spuSaleAttrList"
          :key="item.id"
          :label="item.saleAttrName"
          :value="item.id" />
      </el-select>
      <el-button type="primary" icon="Plus">添加销售属性</el-button>
      <!-- table：展示销售属性与属性值 -->
      <el-table border style="margin: 10px 0">
        <el-table-column label="序号" align="center" width="80px"></el-table-column>
        <el-table-column label="属性名" width="120px"></el-table-column>
        <el-table-column label="属性值"></el-table-column>
        <el-table-column label="操作" width="120px"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import type { UploadProps, UploadUserFile } from 'element-plus'
  import { reqAllTrademark, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr } from '@/api/product/spu'
  import type { HasSaleAttr, HasSpuResponseData, SpuImage, SpuSaleAttr, HasSaleAttrResponseData, AllTrademark, SpuData } from '@/api/product/spu/type'
  import type { Trademark } from '@/api/product/trademark/type'

  // 声明要触发的事件名
  const $emit = defineEmits(['changeScene'])

  // 存储已有的SPU这些数据
  const AllTrademark = ref<Trademark[]>([])
  // 商品图片
  const imageList = ref<SpuImage[]>([])
  // 已有的SPU销售属性<
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
    spuSaleAttrList: []
  })

  const initHasSpuData = async (spu: SpuData) => {
    // spu：父组件传过来的已有的SPU对象[不完整]
    spuParams.value = spu
    // 获取全部品牌的数据
    const result: AllTrademark = await reqAllTrademark()

    // 获取某一个品牌旗下的全部售卖商品图片
    const result1: HasSpuResponseData = await reqSpuImageList(spu.id as number)
    // console.log('result1:', result1)

    // 获取已有的SPU销售属性的数据
    const result2: HasSpuResponseData = await reqSpuHasSaleAttr(spu.id as number)
    // console.log('result2:', result2)

    // 获取整个项目全部SPU的销售属性
    const result3: HasSaleAttrResponseData = await reqAllSaleAttr()
    // console.log('result3:', result3)

    // 存储全部品牌的数据
    AllTrademark.value = result.data
    // SPU对应商品图片
    imageList.value = result1.data.records[0]?.spuImageList  || []
    // 存储已有的SPU的销售属性
    saleAttr.value = result2.data.records[0]?.spuSaleAttrList || []
    // 存储全部的销售属性
    allSaleAttr.value = result3.data;
  }
  // 对外暴露
  defineExpose({initHasSpuData})


  // 点击取消按钮：通知父组件切换场景为1，展示已有的SPU数据
  const cancel = () => {
    // 关键：emit(事件名, 要传的值)
    $emit('changeScene', 0)
  }




  // 以下为plus的源代码
  const dialogImageUrl = ref('')
  const dialogVisible = ref(false)

  const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    console.log(uploadFile, uploadFiles)
  }

  const handlePictureCardPreview: UploadProps['onPreview'] = uploadFile => {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
  }
</script>

<style scoped></style>
