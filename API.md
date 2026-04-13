✅ 服务器运行在 http://localhost:3003

// 添加属性与修改已有属性的参数解释
//修改携带参数
{
    "id": "", //已有的属性的ID
    "attrName": "", //已有的属性的名字
    "attrValueList": [
        {
            "attrId": "", //属性值归属于哪一个属性
            "id": "", //已有的属性值的ID
            "valueName": "string"
        }
    ],
    "categoryId": "", //已有的属性归属于那个三级分类
    "categoryLevel": 3, //代表的是几级分类
}

// 某一个三级分类添加一个新的属性
{
    "attrName": "string", // 新增的属性的名字
    "attrValueList": [ // 新增的属性值数组
        {
            "valueName": "string"
        }
    ],
    "categoryId": "", // 三级分类的ID
    "categoryLevel": 3
}


// 新增SKU -> POST需要参数
{
  "category3Id": "", // 三级分类的ID
  "spuId": "", // 已有的SPU的ID
  "tmId": "", // SPU品牌的ID
  "skuName": "", // sku名字
  "price": "", // sku价格
  "weight": "", // sku重量
  "skuDesc": "", // sku的描述
  "skuAttrValueList": [ // 平台属性的收集
    {
      "attrId": "", // 平台属性的ID
      "valueId": "" // 属性值的ID
    }
  ],
  "skuSaleAttrValueList": [ // 销售属性
    {
      "saleAttrId": "", // 属性ID
      "saleAttrValueId": "" // 属性值的ID
    }
  ],
  "skuDefaultImg": "" // sku图片地址
}