<template>
  <el-form label-width="70px">
    <el-form-item label="sku名称">
      <el-input  placeholder="SKU名称"/>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" type="number"/>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input placeholder="重量(克)" type="number"/>
    </el-form-item>
    <el-form-item label="sku描述">
      <el-input placeholder="SKU描述" type="textarea"/>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item label="手机一级">
          <el-select placeholder="请选择" style="width: 240px; margin: 2px 10px;">
            <el-option label="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电池容量">
          <el-select placeholder="请选择" style="width: 240px; margin: 2px 10px;">
            <el-option label="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运行内存">
          <el-select placeholder="请选择" style="width: 240px; margin: 2px 10px;">
            <el-option label="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机身内存">
          <el-select placeholder="请选择" style="width: 240px; margin: 2px 10px;">
            <el-option label="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="CPU型号">
          <el-select placeholder="请选择" style="width: 240px; margin: 2px 10px;">
            <el-option label="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="屏幕尺寸">
          <el-select placeholder="请选择" style="width: 240px; margin: 2px 10px;">
            <el-option label="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <span>颜色</span><el-select placeholder="请选择" style="width: 240px; margin: 0 10px;"></el-select>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border>
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片"></el-table-column>
        <el-table-column label="名称"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang='ts'>
// 声明要触发的事件名
  const $emit = defineEmits(['changeScene'])

      // 点击取消按钮：通知父组件切换场景为0，展示已有的SPU数据
  const cancel = () => {
    // 关键：emit(事件名, 要传的值)
    $emit('changeScene', {flag: 0, params: ''})
  }
</script>

<style scoped>
</style>
