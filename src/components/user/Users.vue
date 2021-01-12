<template>
  <div>
    <!-- 面包屑 路径区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>

        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >
            </el-button>

            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            >
            </el-button>

            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="light"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser"> 确 定 </el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱规则
    let checkEmail = (rule, value, callback) => { }
    // 验证手机号规则
    let checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) return callback()
      callback(new Error('请输入合法的手机号'))
    }

    return {
      // 获取用户列表参数
      queryInfo: {
        query: '',
        pagenum: 1, // 当前页数
        pagesize: 2, // 每页显示内容
      },
      userlist: [],
      total: 0,
      addDialogVisible: false, // 添加用户对话框的显示与隐藏
      addForm: { // 添加用户的 表单数据
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: { // 添加用户的 表单数据 的规则
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }, {
            min: 3,
            max: 10,
            message: '用户名长度在 3 ～ 10 字符'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }, {
            min: 6,
            max: 15,
            message: '长度在 6 ～ 15 字符'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          }, {
            type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }, {
            validator: checkMobile, trigger: 'blur'
          }
        ]
      },
      editDialogVisible: false, // 修改用户对话框的显示与隐藏
      editForm: {}, // 查询到到用户信息对象
      editFormRules: { // 修改按钮 的表单的验证对象
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          }, {
            type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur',
          }, {
            validator: checkMobile, trigger: 'blur'
          }
        ]
      },
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听 pagesize 改变事件（分页功能 几百条/页）
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听 switch 开关状态的改变 （状态开关）
    async userStateChanged(userInfo) {
      // put 请求过去直接修改
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        // 如果状态不是200，那就不做修改，可是页面已经修改过了，这时候再取反修改回来
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新成功')
    },
    // 监听 添加用户对话框 的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields() // 取消对话框后（未提交成功则）重置表单 resetFields为内置属性
    },
    // 点击 添加用户表单 的确认按钮
    addUser() {
      this.$refs.addFormRef.validate(async valid => { // 预验证（成功为 true，失败为 false）
        if (!valid) return // 如果不为真（false）就退出
        const { data: res } = await this.$http.post('users', this.addForm) // 如果为真就发送请求
        console.log(res)

        if (!res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false // 隐藏添加用户对话框
        this.getUserList() // 重新获取用户列表
      })
    },
    // 点击 修改按钮 修改用户信息
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) { return this.$message.error('查询用户信息失败') }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听 修改用户对话框 的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击 修改用户表单 的确认按钮
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })

        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败')
        }

        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('更新用户信息成功')
      })
    },
    // 点击 删除用户按钮  删除成功返回confirm，失败返回cancel 
    async removeUserById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', ' 删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .catch(err => err)

      if (confirmResult !== 'confirm') { return this.$message.info('已取消删除') } // 等于 .catch
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) { return this.$message.error('删除失败') }
      this.$message.success('删除成功')
      this.getUserList()
    },
  }
}
</script>

<style lang="less" scoped>
</style>>