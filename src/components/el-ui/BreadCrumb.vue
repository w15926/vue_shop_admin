<template>
  <div>
    <template>
      <el-breadcrumb separator-class="el-icon-arrow-right">

        <!-- 如果使用提供的 to属性跳转到同页面会报错 -->
        <el-breadcrumb-item @click.native="goHome" class="breadCrumb">首页
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
  data() {
    return {

    }
  },
  methods: {
    goHome() {
      let currentPath = this.$route.path
      if (currentPath === '/users') return
      this.$router.push('/users')
    }
  }
}
</script>

<style scoped>
.breadCrumb {
  font-weight: 700;
  cursor: pointer;
}
</style>