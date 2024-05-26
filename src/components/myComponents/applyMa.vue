<template>
  <div class="modal" v-show="showMaterial">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2 style="text-align: center;">申请材料表</h2>
      <div class="container">
        <el-container class="table-material-list flex-item">
          <h3 style="text-align: center;">材料列表</h3>
          <el-header>
            <div class="search">
              <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="材料名称">
                  <el-input v-model="searchForm.name" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="searchForm.type" filterable placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                  <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-header>
          <el-main>
            <el-table
              :data="materialList"
              stripe>
              <el-table-column
                prop="name"
                label="名称">
              </el-table-column>
              <el-table-column
                prop="typeInfo"
                label="类型">
              </el-table-column>
              <el-table-column
                prop="price"
                label="价格">
              </el-table-column>
              <el-table-column
                prop="amount"
                label="库存">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                  <el-button @click="selectClick(scope.row)" type="text" >选择</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <div style="text-align: center;">
              <el-pagination
                @current-change="currentPageChange"
                layout="prev, pager, next"
                :total="50">
              </el-pagination>
            </div>
          </el-footer>
        </el-container>
        <el-container class="table-apply-material flex-item">
          <el-header><h3 style="text-align: center;">我申请的材料</h3></el-header>
          <el-main>
            <el-table
              :data="resultTable"
              height="600"
              stripe>
              <el-table-column
              width="60px">
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    size="mini"
                    @click="remove(scope.row, scope.$index)"
                  ></el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="materialName"
                label="名称">
              </el-table-column>
              <el-table-column
                prop="materialTypeName"
                label="类型">
              </el-table-column>
              <el-table-column
                prop="priceSum"
                label="价格">
              </el-table-column>
              <el-table-column
                label="数量">
                <template slot-scope="scope">
                  <!-- 这里使用scope.row来获取当前行的数据，假设你想绑定到一个名为'quantity'的字段 -->
                  <el-input-number
                    v-model="scope.row.materialAmount"
                    @change="handleChange(scope.$index, scope.row)"
                    :min="1"
                    label="申请数量"
                    placeholder="请输入申请数量"
                  ></el-input-number>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer style="display: flex; justify-content: center; align-items: center; height: 50px;">
            <el-button @click="submitApplyMaterial" type="primary" >提交申请</el-button>
          </el-footer>
        </el-container>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getStorage, materialsApply } from '@/api/comment/storage'
export default {
  props: {
    showMaterial: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      pageSize: 5,
      currentPage: 1,
      materialList: [],
      searchForm: {
        name: '',
        type: '',
        page: 1,
        pageSize: 5
      },
      // 选择器值
      options: [{
        value: '1',
        label: '手机'
      },
      {
        value: '2',
        label: '车'
      },
      {
        value: '3',
        label: '手表'
      }],
      // 选择器中显示的值
      valueType: '',
      // 用于存储申请材料表
      resultTable: [],
      // 用与存储申请材料表
      resultMap: null,
      // 用于存储已经选中的storage的id
      selectSet: null
    }
  },
  mounted () {
    this.searchMaterial()
  },
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  methods: {
    // 分页查询
    currentPageChange (val) {
      this.searchForm.page = val
      this.currentPage = val
      if ((val * 5 - 4) <= this.total) {
        this.searchMaterial()
      } else {
        this.$message({
          message: '已展示全部数据',
          type: 'warning'
        })
      }
    },
    // 关闭遮盖层
    closeModal () {
      this.$emit('closeModal')
    },
    // 查询材料
    searchMaterial () {
      getStorage(this.searchForm)
        .then((data) => {
          this.materialList = data.data.data.records
          this.total = data.data.total
        }).catch(error => {
          this.$message.error('查询失败')
          console.error('Error fetching data:', error)
        })
    },
    // 点击查询按钮查询
    search () {
      this.searchForm.page = 1
      this.searchMaterial()
    },
    // 选择材料-数量
    handleChange (i, row) {
      let obj = this.resultMap.get(row.id)
      obj.priceSum = (row.price * row.materialAmount).toFixed(2)
      this.resultMap.set(row.id, obj)
      this.resultTable[i] = obj
    },
    // 保证材料不会被多次选择
    selectClick (row) {
      if (!this.selectSet) {
        this.selectSet = new Set()
      }
      if (!this.selectSet.has(row.id)) {
        this.selectSet.add(row.id)
        if (!this.resultMap) {
          this.resultMap = new Map()
        }
        this.resultMap.set(row.id, {
          id: row.id,
          orderId: this.orderId,
          workerName: this.info.name,
          materialName: row.name,
          type: row.type,
          materialAmount: 1,
          materialTypeName: row.typeInfo,
          price: row.price,
          priceSum: row.price
        })
        this.resultTable.push(...this.resultMap.values())
      } else {
        this.$message({
          message: '这条数据已经选择过了哦~',
          type: 'warning',
          customClass: 'messageClass'
        })
      }
    },
    // 移除右边选中的材料
    remove (row, i) {
      if (this.resultTable && this.resultTable.length > i) {
        // 使用splice方法从数组中移除指定索引的元素
        this.resultTable.splice(i, 1)
        if (this.selectSet && this.selectSet.has(row.id)) {
          const obj = this.selectSet
          this.selectSet = obj
          this.selectSet.delete(row.id)
          this.resultMap.delete(row.id)
        }
      }
    },
    // 重置思索栏
    reset () {
      this.searchForm.name = ''
      this.searchForm.type = ''
      this.searchForm.page = 1
      this.valueType = ''
      this.searchMaterial()
    },
    // 提交申请材料表
    submitApplyMaterial () {
      materialsApply(this.resultTable)
        .then((data) => {
          this.$message({
            message: '申请成功',
            type: 'success'
          })
        }).catch(error => {
          this.$message.error('申请失败')
          console.error('Error fetching data:', error)
        })
    }
  }
}
</script>

<style scoped>
  .modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
    z-index: 10; /* 确保z-index比其他元素高 */
  }

  .modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 100%; /* 或指定一个固定的宽度 */
    height: 100%;
  }

  .container {
    display: flex; /* 设置为弹性容器 */
    justify-content: center; /* 水平居中（可选） */
    align-items: stretch; /* 垂直方向拉伸（默认） */
  }
  .flex-item {
    /* 这里的样式可以根据需要进行调整 */
    flex: 1; /* 弹性因子，表示每个项目占据的空间比例，这里设为1表示等宽 */
    margin: 10px; /* 可以添加间距 */
    /* 其他样式 */
  }
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }
  .messageClass{
    z-index: 99999999 !important;
  }

   .el-message {
     z-index: 99999999 !important;
   }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
</style>
