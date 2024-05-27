<template>
  <d2-container class="page">
    <el-container class="table-material-list">
      <el-header>
        <div class="search">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item label="申请状态">
              <el-select v-model="searchForm.status" filterable placeholder="请选择">
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
              <el-button type="primary" icon="el-icon-search" @click="searchMaterial">搜索</el-button>
              <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <div class="table-my-order">
          <el-table
            :data="tableData"
            :span-method="objectSpanMethod"
            border
            style="width: 100%; margin-top: 20px">
            <el-table-column
              prop="orderId"
              label="订单号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="materialName"
              label="材料">
            </el-table-column>
            <el-table-column
              prop="materialAmount"
              label="数量">
            </el-table-column>
            <el-table-column
              prop="priceSum"
              label="价格（元）">
            </el-table-column>
            <el-table-column
              prop="statusInfo"
              label="申请状态">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button @click="searchOrderInfo(scope.row.orderId)" type="text">查看工单</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
    <order-info :showModal="showModal" :orderInfo="orderInfo" @closeModal="closeModal" :orderId="orderId"></order-info>
  </d2-container>
</template>

<script>
import { getMaterialReq } from '@/api/comment/materialReq'
import { WorkerSearchOrder } from '@/api/comment/repairOrder'
export default {
  name: 'applyMaterial',
  data () {
    return {
      pageSize: 10,
      currentPage: 1,
      total: '',
      searchForm: {
        id: '',
        materialName: '',
        status: '',
        page: 1,
        pageSize: 10
      },
      tableData: [],
      currentRow: null,
      orderIdMap: null,
      preOrderId: '',
      rowMap: null,
      // 用于控制详情遮罩层
      showModal: false,
      orderId: '',
      // 工单详情
      orderInfo: null,
      // 选择器中的枚举
      // 选择器值
      options: [
        {
          value: '1',
          label: '库存不足'
        },
        {
          value: '2',
          label: '申请成功'
        }]
    }
  },
  created () {
    this.searchMaterial()
    this.getMap()
  },
  methods: {
    // 分页查询
    currentPageChange (val) {
      if ((val * this.pageSize - (this.pageSize - 1)) <= this.total) {
        this.searchForm.page = val
        this.currentPage = val
        this.searchMaterial()
      } else {
        this.$message({
          message: '已展示全部数据',
          type: 'warning'
        })
      }
    },
    // 待定呀
    getMap () {
      if (this.orderIdMap === null) {
        this.orderIdMap = new Map()
      }
      if (this.rowMap === null) {
        this.rowMap = new Set()
      }
      this.tableData.forEach((item) => {
        console.log(item.id, item.orderId, item.materialName)
        if (!this.orderIdMap.has(item.orderId)) {
          this.orderIdMap.set(item.orderId, 1)
        } else {
          const count = this.orderIdMap.get(item.orderId) + 1
          this.orderIdMap.set(item.orderId, count)
        }
      })
    },
    // 进度查询
    scheduleSearch (row) {},
    // 用户查询工单
    searchMaterial () {
      getMaterialReq(this.searchForm)
        .then((data) => {
          this.tableData = data.data.records
          this.total = data.data.total
        }).catch(error => {
          this.$message.error('查询失败')
          console.error('Error fetching data:', error)
        })
    },
    // 用户确认工单
    confirmOrder (row) {},
    // 用户取消工单
    cancelOrder (row) {
      console.log(row)
    },
    // 渲染表格
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 6) {
        const orderId = row.orderId
        let rowspan = 1
        // 计算当前 orderId 的行数
        for (let i = rowIndex + 1; i < this.tableData.length; i++) {
          if (this.tableData[i].orderId === orderId) {
            rowspan++
          } else {
            break
          }
        }
        // 如果当前行是第一个 orderId 出现的位置，则合并
        if (rowIndex === 0 || this.tableData[rowIndex - 1].orderId !== orderId) {
          return {
            rowspan,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    // 关闭遮罩层
    closeModal () {
      this.showModal = false
    },
    // 查询工单详情
    searchOrderInfo (orderId) {
      this.orderInfo = null
      WorkerSearchOrder({
        id: orderId,
        page: 1,
        pageSize: 1
      })
        .then((data) => {
          this.orderId = orderId
          this.showModal = true
          this.orderInfo = data.data.records[0]
        }).catch(error => {
          this.$message.error('查询失败')
          console.error('Error fetching data:', error)
        })
    },
    // 重置思索栏
    reset () {
      this.searchForm.status = ''
      this.searchForm.page = 1
      this.searchMaterial()
    }
  }
}
</script>

<style lang="scss">
</style>
