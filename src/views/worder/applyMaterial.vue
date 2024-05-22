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
          id: '5',
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
    objectSpanMethod2 ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) { // 只在第一列上应用合并
        // if (rowIndex === 0) { // 第一行始终显示
        //   return {
        //     rowspan: 1,
        //     colspan: 1
        //   }
        // }

        // 检查当前行和前一行的 orderId 是否相同
        const prevRow = this.tableData[rowIndex - 1] || null
        if (prevRow.orderId === row.orderId || prevRow === null) {
          // 如果相同，则当前单元格不需要显示，合并到上一行
          return {
            rowspan: 0,
            colspan: 0
          }
        } else {
          // 计算当前 orderId 连续的行数
          const currentRow = row
          let rowspan = 1
          while (
            rowIndex + rowspan < this.tableData.length &&
            this.tableData[rowIndex + rowspan].orderId === currentRow.orderId
          ) {
            rowspan++
          }
          // 返回合并单元格的配置
          return {
            rowspan,
            colspan: 1
          }
        }
      }
    },
    objectSpanMethod1 ({ row, column, rowIndex, columnIndex }) {
      debugger
      if (columnIndex === 0) {
        if (this.preOrderId !== null && this.preOrderId !== '') {
          if (!this.rowMap.has(rowIndex)) {
            this.rowMap.add(rowIndex)
            if (this.preOrderId !== row.orderId) {
              this.preOrderId = row.orderId
              console.log(this.orderIdMap.get(row.orderId))
              return {
                rowspan: this.orderIdMap.get(row.orderId),
                colspan: 1
              }
            }
          }
        } else {
          this.preOrderId = row.orderId
          this.rowMap.add(rowIndex)
          return {
            rowspan: this.orderIdMap.get(row.orderId),
            colspan: 1
          }
        }
      }
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      debugger
      if (columnIndex === 0) {
        if (this.preOrderId === null || this.preOrderId !== row.orderId) {
          this.preOrderId = row.orderId
          const count = this.orderIdMap.get(row.orderId)
          return {
            rowspan: count,
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
