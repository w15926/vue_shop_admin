<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="@/assets/img/favicon.png" @click="backHome" title="home" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout"> 退出 </el-button>
    </el-header>

    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-btn" @click="toggleCollapse">|||</div>
        <!-- 菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409bff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="this.$router.history.current.path"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符（显示子路由welcome等） -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

 <script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      iconsObj: {
        '125': 'iconfont icon-renwu',
        '103': 'iconfont icon-permissions',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-icon',
        '145': 'iconfont icon-iconfontpaixingbang'
      },
      isCollapse: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    // 退出按钮
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.info('退出成功')
    },
    // 点击logo返回 /home
    backHome() {
      // this.$router.push('/home')
      // 防止重复点击报错
      this.$router.push({
        path: '/home'
      },
        onComplete => { }, // 完成的时候显示
        onAbort => { } // 中止的时候显示
      )
    },
    // 获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log(res)
    },
    // 折叠与展开菜单
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  // padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    img {
      height: 40px;
      vertical-align: middle;
      margin-right: 20px;
      cursor: pointer;
    }
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
  color: #fff;
}

.toggle-btn {
  background-color: #4a5064;
  font-size: 10px;
  height: 24px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  user-select: none;
  letter-spacing: 4px;
  cursor: pointer;
}
</style>