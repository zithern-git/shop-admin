<template>
  <el-card style="width: 100%" shadow="always">
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" style="width: 200px">
          <el-option label="上海" value="shanghai" />
          <el-option label="北京" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" style="width: 200px">
          <el-option label="广州" value="guangzhou" />
          <el-option label="深圳" value="shenzhen" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" style="width: 200px">
          <el-option label="Zone one" value="one" />
          <el-option label="Zone two" value="two" />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts"></script>

<style scoped></style>
