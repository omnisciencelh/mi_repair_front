<template>
  <d2-container class="page">
    <el-container class="table-user-pay">
      <el-header>
        <div class="search">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item label="支付状态">
              <el-input v-model="searchForm.status" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="searchPay">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <div class="table-my-order">
          <el-table
            ref="singleTable"
            :data="tableData"
            highlight-current-row
            @current-change="handleCurrentChange"
            style="width: 100%">
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              property="repairOrder.userName"
              label="姓名"
              width="80">
            </el-table-column>
            <el-table-column
              property="repairOrder.sn"
              label="sn信息">
            </el-table-column>
            <el-table-column
              property="price"
              label="价格">
            </el-table-column>
            <el-table-column
              property="statusInfo"
              label="支付状态">
            </el-table-column>
            <el-table-column
              property="createTime"
              label="下单日期">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="250">
              <template slot-scope="scope">
                <el-button @click="scheduleSearch(scope.row)" type="text">进度查询</el-button>
                <el-button @click="payment(scope.row)" v-if="scope.row.repairOrder.status===21" type="text">待支付</el-button>
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
  </d2-container>
</template>

<script>
export default {
  name: 'payList',
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
      tableData: [{
        id: '',
        repairOrder: {
          userName: '王一博',
          sn: 'sa345',
          status: 21
        },
        price: '23',
        status: 1,
        statusInfo: '未支付',
        createTime: '2024-05-16 10:32'
      }],
      currentRow: null
    }
  },
  created () {
    this.searchPay()
  },
  methods: {
    // 分页查询
    currentPageChange (val) {
      this.searchForm.page = val
      this.currentPage = val
      this.searchPay()
    },
    // 进度查询
    scheduleSearch (row) {},
    // 用户查询支付流水
    searchPay () {},
    // 用户支付支付
    payment () {}
  }
}
</script>

<style lang="scss">
.table-user-pay{
}
</style>
