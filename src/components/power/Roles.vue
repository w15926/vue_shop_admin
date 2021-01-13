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
            <!-- 24列栅格布局 动态绑定calss是数组写法 -->
            <!-- 动态绑定，给每一个都添加bd-bottom，如果index1是0，给他添加bd-top -->
            <el-row
              :class="['bd-bottom', i1 === 0 ? 'bd-top' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="i1"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <!-- 双重 for循环渲染二级 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bd-top', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="i2"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
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
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >
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

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightdialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
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
      addDialogVisible: false, // 添加用户对话框
      editDialogVisible: false, // 修改用户对话框
      editForm: {}, // 查询到到用户信息对象,
      addForm: {},
      setRightdialogVisible: false, // 分配权限对话框
      rightsList: [],
      treeProps: { // 树形控件的绑定对象
        label: 'authName',
        children: 'children',
      },
      defKeys: [], // 默认选中的节点 id值
      roleId: '', // 当前权限列表的id
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')

      if (res.meta.status !== 200) { return this.$message.error('获取角色列表失败') }

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
    },
    // 根据 ID删除对应的权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .catch(err => err)

      if (confirmResult !== 'confirm') return this.$message.info('取消了删除')

      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')

      // 重新获取会刷新整个页面，打开的列表会关闭，
      // this.getRolesList()
      // 直接赋值过去修改里面的值就行
      role.children = res.data
    },
    // 显示分配权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id

      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限失败')
      this.rightsList = res.data
      console.log(this.rightsList)

      // 递归获取三级节点的 ID
      this.getLeafKeys(role, this.defKeys)

      this.setRightdialogVisible = true
    },
    // 通过递归的方式获得所有三级权限下的 id，并保存到 defKeys数组
    getLeafKeys(node, arr) {
      // 如果当前节点不包含 children，则按照三级节点计算
      if (!node.children) return arr.push(node.id)

      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        // getCheckedKeys el-ui树形方法，显示全选状态返回的key
        // getHalfCheckedNodes             半选
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedNodes(),
      ]

      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')

      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightdialogVisible = false

      console.log(keys)
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bd-top {
  border-top: 1px solid #eee;
}

.bd-bottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>