<template>
  <el-card>
    <el-table :data="skuArr" border style="margin-bottom: 10px">
      <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
      <el-table-column
        label="名称"
        prop="skuName"
        show-overflow-tooltip
        width="150px"
      ></el-table-column>
      <el-table-column
        label="描述"
        prop="skuDesc"
        show-overflow-tooltip
        width="150px"
      ></el-table-column>
      <el-table-column label="默认图片" width="150px">
        <template #default="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="重量(g)" prop="weight" width="150px"></el-table-column>
      <el-table-column label="价格(元)" prop="price" width="150px"></el-table-column>
      <el-table-column label="操作" fixed="right" width="250px">
        <template #default="{ row }">
          <el-button type="success" size="small"
            @click="updateSale(row)"
            :icon="row.isSale === 1 ? 'Bottom' : 'Top'"></el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateSku"></el-button>
          <el-button type="info" size="small" icon="InfoFilled" @click="findSku(row)"></el-button>
          <el-popconfirm :title="`确认要删除${row.skuName}吗？`" @confirm="removeSku(row.id)" width="200px">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 7, 10]"
      :background="true"
      layout="prev,pager,next,jumper,->, sizes, total"
      :total="total"
      @current-change="getHasSku"
      @size-change="handler"
    />
    <!-- 抽屉组件：展示商品详情 -->
     <el-drawer  v-model="drawer" title="查看商品详情">
      <template #default>
        <!-- <el-form>
          <el-form-item label="名称">{{  }}</el-form-item>
          <el-form-item label="描述"></el-form-item>
          <el-form-item label="价格"></el-form-item>
          <el-form-item label="平台属性">
            <el-tag>123</el-tag>
          </el-form-item>
          <el-form-item label="销售属性">
            <el-tag>456</el-tag>
          </el-form-item>
          <el-form-item label="商品图片"></el-form-item>
        </el-form> -->
        <el-row style="margin: 10px 0;">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{skuInfo.skuDesc}}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{skuInfo.price}}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">重量(g)</el-col>
          <el-col :span="18">{{skuInfo.weight}}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">默认图片</el-col>
          <el-col :span="18">
            <img :src="skuInfo.skuDefaultImg" style="width: 100px; height: 100px;" />
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag style="margin: 5px;" v-for="item in skuInfo.skuAttrValueList" :key="item.valueId">{{ item.valueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag type="success" style="margin: 5px;" v-for="item in skuInfo.skuSaleAttrValueList" :key="item.saleAttrValueId">{{ item.saleAttrValueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl" alt="商品图片" style="width: 100%; height: 100%;"/>
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  // 引入请求
  import { reqSkuList, reqSaleSku, reqCancelSale, reqSkuInfo, reqRemoveSku } from '@/api/product/sku'
  import { type SkuData, type SkuResponseData } from '@/api/product/sku/type'
  import { ElMessage } from 'element-plus'
  import type { SkuInfoData } from '@/api/product/sku/type'

  // 分页器当前页码
  const pageNo = ref<number>(1)
  // 分页器每页条数
  const pageSize = ref<number>(5)
  // 分页器总条数
  const total = ref<number>(0)
  //
  const skuArr = ref<SkuData[]>([])
  // 控制抽屉显示与隐藏的字段
  const drawer = ref<boolean>(false)
  const skuInfo = ref<any>({
    category3Id: '', // 三级分类的ID
    spuId: '', // 已有的SPU的ID
    tmId: '', // SPU品牌的ID
    skuName: '', // sku名字
    price: '', // sku价格
    weight: '', // sku重量
    skuDesc: '', // sku的描述
    skuDefaultImg: '', // 默认图片
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    skuImageList: []
  })

  // 获取已有的SKU
  const getHasSku = async (pager = 1) => {
    pageNo.value = pager
    const result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
    // console.log(result)
    if (result.code === 200) {
      skuArr.value = result.data.records
      total.value = result.data.total
      ElMessage.success(result.message)
    } else {
      ElMessage.error(result.message)
    }
  }

  // 商品上架与下架的操作
  const updateSale = async (row: SkuData) => {
    // 若isSale === 1，说明当前商品是上架的状态->更新为下架
    if (row.isSale) {
      // 下架操作
      await reqCancelSale(row.id as number)
      ElMessage.success('下架成功')
      row.isSale = 0
      // 发请求获取当前更新完毕的全部已有的SKU
      // getHasSku()
    } else {
      await reqSaleSku(row.id as number)
      ElMessage.success('上架成功')
      row.isSale = 1
      // getHasSku()
    }
  }

  // 更新已有的SKU
  const updateSku = () => {
    ElMessage.success('程序员正在努力更新中...')
  }

  // 点击查看商品详情按钮的回调
  const findSku = async (row: SkuData) => {
    // 抽屉展示出来
    drawer.value = true
    // 获取已有商品详情数据
    const result:SkuInfoData = await reqSkuInfo(row.id as number)
    console.log(result)
    if (result.code === 200) {
      // 存储已有的SKU
      skuInfo.value= result.data
    }
  }

  //删除某一个已有的商品
  const removeSku = async (id: number) => {
    const result:any = await reqRemoveSku(id)
    if (result.code === 200) {
      // 提示信息
      ElMessage.success(result.message)
      // 获取已有全部商品
      getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } else {
      ElMessage.error(result.message)
    }
  }

  // 每页条数变化时的回调
  const handler = () => {
    getHasSku()
  }

  // 组件挂载完毕
  onMounted(() => {
    getHasSku()
  })
</script>

<style scoped>
/* 强制轮播指示器一行水平展示 */
:deep(.el-carousel__indicators) {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important; /* 禁止换行 */
  justify-content: center !important; /* 居中对齐 */
  align-items: center !important;
  gap: 8px !important; /* 指示器之间的间距（可自行调整） */
}

/* 针对卡片式轮播的指示器单独优化 */
:deep(.el-carousel__indicator--card) {
  display: inline-block !important;
  flex-shrink: 0 !important; /* 防止指示器被压缩 */
}
</style>
