<template>
  <div>
    <!-- 面包屑导航区域 -->
    <bread-crumb>
      <template #pathTwo>商品管理</template>
      <template #pathThree>参数列表</template>
    </bread-crumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert title="注意：只允许为三级分类设置相关参数" type="warning" show-icon>
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat-opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择框 -->
          <el-cascader v-model="selectedCateKeys" :options="cateList" :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
            }" @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>

      <!-- 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled"
            @click="addDialogVisible = true">
            动态参数
          </el-button>
          <!-- 表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 渲染 tag -->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable
                  @close="handelClose(i, scope.row)">
                  {{ item }}
                </el-tag>

                <!-- tag文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>

                <!-- tag新增 -->
                <el-button v-else class="button-new-tag" size="small"
                  @click="showInput(scope.row)">
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="名称"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                  @click="showEditDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  @click="removeParams(scope.row.attr_id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled"
            @click="addDialogVisible = true">
            静态属性
          </el-button>
          <!-- 表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 渲染 tag -->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable
                  @close="handelClose(i, scope.row)">
                  {{ item }}
                </el-tag>

                <!-- tag文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>

                <!-- tag新增 -->
                <el-button v-else class="button-new-tag" size="small"
                  @click="showInput(scope.row)">
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="名称"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                  @click="showEditDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  @click="removeParams(scope.row.attr_id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%"
      @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"
        label-width="100px">
        <el-form-item :label="activeName" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams"> 确 定 </el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="editDialogVisible" width="50%"
      @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef"
        label-width="100px">
        <el-form-item :label="activeName" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import breadCrumb from '@/components/el-ui/BreadCrumb'

export default {
  data() {
    return {
      cateList: [], // 商品分类参数
      selectedCateKeys: [], //级联选择框双向绑定的数组
      activeName: 'many', // 被激活的页签点击名称(值是页面打开默认加载的标签)
      manyTableData: [], // 动态参数数据
      onlyTableData: [], // 静态参数数据
      addDialogVisible: false, // 添加对话框
      addForm: { // 添加参数的表单
        attr_name: ''
      },
      addFormRules: { // 添加参数的表单的验证对象
        attr_name: [
          {
            required: true,
            message: '请输入参数',
            trigger: 'blur'
          }
        ]
      },
      editDialogVisible: false, // 编辑对话框
      editForm: { // 编辑参数按钮的表单
        attr_name: ''
      },
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数',
            trigger: 'blur'
          }
        ]
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类参数列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类参数列表失败')

      this.cateList = res.data
      console.log(this.cateList)
    },
    // 级联选择框 change事件
    handleChange() {
      this.getParamsData()
    },

    // tab页签点击处理函数
    handleClick() {
      console.log(this.activeName)
      this.getParamsData()
    },
    // 得到参数列表
    async getParamsData() {
      // 证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }

      // 证明选中的是三级分类
      console.log(this.selectedCateKeys)

      // 根据选中的页签 activeName显示对应的参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')

      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false // 展开列 tag 文本框切换显示
        item.inputValue = '' // 展开列 tag 文本框中的内容
      })

      console.log(res.data)

      // 根据 activeName分别保存对应数据
      if (this.activeName == 'many') return this.manyTableData = res.data
      this.onlyTableData = res.data
    },
    // 关闭 添加对话框事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加对话框确定按钮
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })

        if (res.meta.status !== 201) return this.$message.error('添加参数失败')

        this.$message.success('添加参数成功')
        this.getCateList()
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    // 编辑对话框
    async showEditDialog(attr_id) {
      // 查询当前信息参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {
        params: {
          attr_sel: this.activeName
        }
      })

      if (res.meta.status !== 200) return this.$message.error('查询当前参数失败')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 关闭 编辑对话框事件
    editDialogClosed() {
      // 每次打开自动加载对应(showEditDialog())，顶替掉重置
      // this.$refs.editFormRef.resetFields()
    },
    // 编辑对话框确定按钮
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`
          , {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          })

        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 删除按钮
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .catch(err => err)

      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')

      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getParamsData()
    },
    // 展开列 tag 文本框 blur与enter显示
    async handleInputConfirm(row) {
      // 如果没有输入内容
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }

      // 如果输入了内容
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 展开列 tag 新增按钮
    showInput(row) {
      row.inputVisible = true
      // 自动获取表单焦点
      this.$nextTick(() => { // $nestTick()页面重新渲染完毕后要加载的函数
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 展开列 tag 删除按钮
    handelClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
    // 将 attr_vals保存到数据库
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })

      if (res.meta.status !== 200) return this.$message.error('像服务器提交失败')
      this.$message.success('修改成功')
    }
  },
  computed: {
    // 如果按钮需要被禁用返回 true
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) return true
      return false
    },
    // 当前选中三级分类的 id
    cateId() {
      if (this.selectedCateKeys.length == 3) return this.selectedCateKeys[2]
      return null
    },
    // 动态计算对话框标题
    titleText() {
      if (this.activeName == 'many') return '动态参数'
      return '静态属性'
    }
  },
  components: {
    breadCrumb
  }
}
</script>

<style lang="less" scoped>
.cat-opt {
  margin: 15px 0px;
}

.el-cascader {
  width: 400px;
}

.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 100px;
}
</style>