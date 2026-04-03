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