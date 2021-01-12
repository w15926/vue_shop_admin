<template>
  <div>
    <!-- 面包屑 路径区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="treeTable"
      >
        <!-- 是否有效 -->
        <!-- <template slot="isok" v-slot="scope"> -->
        <!-- <template v-slot:isOk="scope"> -->
        <template #isOk="scope">
          <i
            class="el-icon-success"
            v-if="!scope.row.deleted"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>

        <!-- 排序 -->
        <template #order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
          >
            二级
          </el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template #opt="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showEditDialog(scope.row.cat_id)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="removeUserById(scope.row.cat_id)"
          >
            删除
          </el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options用来指定数据源 -->
          <el-cascader
            v-model="selectedKeys"
            :options="paraentCateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
              checkStrictly: true,
            }"
            @change="paraentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate"> 确 定 </el-button>
      </span>
    </el-dialog>

    <!-- 编辑按钮对话框 -->
    <el-dialog
      title="修改名称"
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
        <el-form-item label="名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editUserInfo">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1, // 显示第几页
        pagesize: 5, // 每页显示几个
      },
      cateList: [], // 商品列表
      total: 0, // 总数据条数
      columns: [ // tree-table对应的列 
        {
          label: '分类名称',
          prop: 'cat_name'
        }, {
          label: '是否有效',
          type: 'template', // 使用自定义模版
          template: 'isOk', // 自定义模版绑定的数据（插槽名字）
        }, {
          label: '排序',
          type: 'template',
          template: 'order'
        }, {
          label: '操作',
          type: 'template',
          template: 'opt',
          width: '181px'
        }
      ],
      addCateDialogVisible: false, // 添加分类对话框的显示
      addCateForm: { // 添加分类表单数据
        cat_name: '', // 将要添加的分类的名字
        cat_pid: 0, // 父级分类的 id
        cat_level: 0, // 分类等级，默认添加一级分类
      },
      addCateFormRules: { // 添加用户表单验证规则
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      paraentCateList: [], // 父级分类列表
      selectedKeys: [], // 选中的父级分类 id数组
      editDialogVisible: false, // 编辑按钮对话框
      editForm: {},
      editFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) { return this.$message.error('获取商品分类列表失败') }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮，展示添加分类对话框
    showAddCateDialog() {
      this.getParaentCateList() // 获取父级分类的数据列表
      this.addCateDialogVisible = true
    },
    // 得到父级分类列表
    async getParaentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })

      if (res.meta.status !== 200) { return this.$message.error('获取父级列表失败') }
      this.paraentCateList = res.data
      console.log(res.data)
    },
    // 选择项发生改变触发的函数
    paraentCateChange() {
      console.log(this.selectedKeys)
      // 如果 selectedKeys 数组中的 length 大于 0 ，证明选中父级分类。反之则无
      if (this.selectedKeys.length > 0) {
        // 父级分类的 ID
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        // 父级分类的 ID
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类表单确认按钮
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return this, $message.error('验证失败')
        const { data: res } = await this.$http.post('categories', this.addCateForm)

        if (res.meta.status !== 201) return this.$message.error('添加分类失败')

        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 关闭添加用户对话框重置表单
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 点击 编辑按钮 编辑信息
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error('名称查询失败')
      this.editForm = res.data

      this.editDialogVisible = true
    },
    // 关闭编辑按钮重置表单
    editDialogClosed() {
      // 已经设置每次打开自动获取当前名称
      // this.$refs.editFormRef.resetFields()
    },
    // 点击编辑按钮对话框的 确定按钮
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请输入正确内容')
        const { data: res } = await this.$http.put('categories/' + this.editForm.cat_id, {
          cat_name: this.editForm.cat_name
        })

        if (res.meta.status !== 200) return this.$message.error('更新用户信息失败')

        this.$message.success('更新名称成功')
        this.getCateList()
        this.editDialogVisible = false
      })
    },
    // 点击 删除按钮
    async removeUserById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户，是否继续？', '删除提示', {
        confirmButtonTest: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .catch(err => err) // 截取无意义报错

      if (confirmResult !== 'confirm') return this.$message.info('已取消删除') // 等价于 .catch

      const { data: res } = await this.$http.delete('categories/' + id)
      if(res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>