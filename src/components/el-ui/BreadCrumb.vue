<template>
  <div>
    <template id="breadCrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }" class="breadCrumb">首页
        </el-breadcrumb-item>

        <el-breadcrumb-item>
          <slot name="pathTwo"> </slot>
        </el-breadcrumb-item>

        <el-breadcrumb-item>
          <slot name="pathThree"></slot>
        </el-breadcrumb-item>

      </el-breadcrumb>
    </template>
  </div>
</template>

<script>
export default {

}
</script>