<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 start -->
      <div class="avatar_box">
        <img src="@/assets/img/logo.png" alt="" />
      </div>
      <!-- 头像区域 end -->

      <!-- 登录表单区域 start -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            placeholder="用户名"
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          >
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="密码"
            v-model="loginForm.password"
            show-password
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 登录表单区域 end -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登陆表单数据
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      // 表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 - 10 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 - 15 个字符', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    // 重置按钮
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录按钮
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return // valid为假则不继续运行
        const { data: res } = await this.$http.post('login', this.loginForm) // data: res解构data并重命名为res
        if (res.meta.status != 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        
        window.sessionStorage.setItem('token', res.data.token) // token保存在sessionStorage里（页面关闭清除缓存）
        this.$router.push('/home')
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  position: relative;
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;

  background-color: #fff;
  border-radius: 3px;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  width: 130px;
  height: 130px;

  border: 1px solid #eee;
  border-radius: 50%;
  background-color: #fff;

  padding: 10px;
  box-shadow: 0 0 10px #ddd;

  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form {
  position: absolute;
  left: 5%;
  bottom: 0;
  width: 90%;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
