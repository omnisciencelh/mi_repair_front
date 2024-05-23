<template>
  <d2-container class="page">
    <el-container class="table-material-list">
      <el-header>
        <div class="search">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item label="申请状态">
              <el-input v-model="searchForm.status" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="searchMaterial">搜索</el-button>
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
              label="价格（元）">
            </el-table-column>
            <el-table-column
              prop="status"
              label="申请状态">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间">
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
  </d2-container>
</template>

<script>
export default {
  name: 'applyMaterial',
  data () {
    return {
      pageSize: 5,
      currentPage: 1,
      total: '',
      searchForm: {
        status: '',
        page: 1,
        pageSize: 5
      },
      tableData: [
        {
          id: '1',
          orderId: '12',
          materialName: '玻璃',
          materialAmount: 233,
          status: 0,
          createTime: '2016:11:11'
        },
        {
          id: '2',
          orderId: '12',
          materialName: '轮胎',
          materialAmount: 34,
          status: 0,
          createTime: '2016:11:11'
        },
        {
          id: '3',
          orderId: '12',
          materialName: '插口',
          materialAmount: 233,
          status: 0,
          createTime: '2016:11:11'
        },
        {
          id: '4',
          orderId: '15',
          materialName: 'XX',
          materialAmount: 233,
          status: 0,
          createTime: '2016:11:11'
        },
        {
          id: '6',
          orderId: '15',
          materialName: 'XX',
          materialAmount: 233,
          status: 0,
          createTime: '2016:11:11'
        },
        {
          id: '7',
          orderId: '9',
          materialName: 'XX',
          materialAmount: 233,
          status: 0,
          createTime: '2016:11:11'
        }
      ],
      currentRow: null,
      orderIdMap: null,
      preOrderId: '',
      rowMap: null
    }
  },
  created () {
    this.searchMaterial()
    this.getMap()
  },
  methods: {
    // 分页查询
    currentPageChange (val) {
      this.searchForm.page = val
      this.currentPage = val
      this.searchMaterial()
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
    searchMaterial () {},
    // 用户确认工单
    confirmOrder (row) {},
    // 用户取消工单
    cancelOrder (row) {
      console.log(row)
    },
    // 渲染东西的
    // objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
    //   debugger
    //   if (columnIndex === 0) {
    //     if (this.preOrderId === null || this.preOrderId !== row.orderId) {
    //       this.preOrderId = row.orderId
    //       const count = this.orderIdMap.get(row.orderId)
    //       return {
    //         rowspan: count,
    //         colspan: 1
    //       }
    //     } else {
    //       return {
    //         rowspan: 0,
    //         colspan: 0
    //       }
    //     }
    //   }
    // }
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
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
    }
  }
}
</script>

<style lang="scss">
</style>
