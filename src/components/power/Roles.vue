<template>
  <div>
    <!-- 面包屑 路径区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <pre>
              {{ scope.row }}
            </pre>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            >
              编辑
            </el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeEditDialog(scope.row.id)"
            >
              删除
            </el-button>
            <!-- 分配角色按钮 -->
            <el-button size="mini" type="warning" icon="el-icon-setting">
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容区域 -->
      <el-form :model="addForm" ref="editFormRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser"> 确 定 </el-button>
      </span>
    </el-dialog>

    <!-- 编辑按钮对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表
      roleList: [],
      addDialogVisible: false, // 修改用户对话框的显示与隐藏
      editDialogVisible: false, // 修改用户对话框的显示与隐藏
      editForm: {}, // 查询到到用户信息对象,
      addForm: {}
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')

      if (res.meta.status !== 200) { return this.$message.console.error('获取角色列表失败') }

      this.roleList = res.data
    },
    // 点击 编辑按钮 修改用户信息
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) { return this.$message.error('修改用户信息失败') }
      this.editForm = res.data
      console.log(this.editForm)
      console.log(res)
      this.editDialogVisible = true
    },
    // 监听 修改用户对话框 的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击 编辑用户表单 的确认按钮
    async editUserInfo() {
      const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, {
        roleName: this.editForm.roleName,
        roleDesc: this.editForm.roleDesc
      })

      if (res.meta.status !== 200) { return this.$message.error('修改用户信息失败') }

      this.getRolesList()
      this.editDialogVisible = false
      this.$message.success('更新用户信息成功')
    },
    // 删除按钮
    async removeEditDialog(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', ' 删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .catch(err => err)

      if (confirmResult !== 'confirm') { return this.$message.info('已取消删除') } // 等于 .catch
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) { return this.$message.error('删除失败') }
      this.$message.success('删除成功')
      this.getRolesList()
    },
    // 点击添加角色按钮
    addRole() {
      this.addDialogVisible = true
    },
    // 点击添加角色表单确认按钮
    async addUser() {
      const { data: res } = await this.$http.post('roles', {
        roleName: this.addForm.roleName,
        roleDesc: this.addForm.roleDesc
      })

      if (res.meta.status !== 201) {
        console.log(res)
        this.$message.error('添加用户失败')
      }

      this.$message.success('添加用户成功')
      this.addDialogVisible = false // 隐藏添加用户对话框
      this.getRolesList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>