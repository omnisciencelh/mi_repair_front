<template>
  <d2-container class="page">
    <el-container class="table-user-order">
      <el-header>
        <div class="search">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item label="工单状态">
              <el-input v-model="searchForm.status" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="searchOrder">搜索</el-button>
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
            style="width: 100%">
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              property="userName"
              label="姓名"
              width="80">
            </el-table-column>
            <el-table-column
              property="userPhone"
              label="联系电话">
            </el-table-column>
            <el-table-column
              property="userAddr"
              label="地址">
            </el-table-column>
            <el-table-column
              property="goodsInfo"
              label="商品信息">
            </el-table-column>
            <el-table-column
              property="sn"
              label="sn编号">
            </el-table-column>
            <el-table-column
              property="description"
              label="故障描述">
            </el-table-column>
            <el-table-column
              property="createTime"
              label="下单日期">
            </el-table-column>
            <el-table-column
              property="statusInfo"
              label="工单状态">
              <template slot-scope="scope">
                <span :class="{ 'red-button': scope.row.status === 3 || scope.row.status === 17 }">
                  {{ scope.row.status === 3 ?'您已取消工单':scope.row.statusInfo }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="300">
              <template slot-scope="scope">
                <el-button @click="searchOrderInfo(scope.row.id)" type="text">查看详情</el-button>
                <el-button @click="scheduleSearch(scope.row)" type="text">进度查询</el-button>
                <el-button v-if="scope.row.status===1" @click="confirmOrder(scope.row)" type="text">确认工单</el-button>
                <el-button v-if="scope.row.status===1  || scope.row.status===14" @click="cancelOrder(scope.row)" type="text">取消工单</el-button>
                <el-button v-if="scope.row.status===21" type="text" class="green-button">去支付</el-button>
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
    <order-info :isUser="true" :orderInfo="orderInfo" :showModal="showModal" @closeModal="closeModal" :orderId="orderId"></order-info>
  </d2-container>
</template>

<script>
import { UserSearchOrder, UserConfirmOrder} from '@/api/comment/repairOrder'
export default {
  data () {
    return {
      pageSize: 5,
      currentPage: 1,
      total: '',
      searchForm: {
        userId: null,
        status: null,
        page: 1,
        pageSize: 5
      },
      // 传给子组件的维修工单
      orderInfo: null,
      tableData: [],
      currentRow: null,
      // 用于控制遮盖层
      showModal: false,
      // 用户查询工单详情
      orderId: ''
    }
  },
  created () {
    this.searchOrder()
  },
  methods: {
    // 分页查询
    currentPageChange (val) {
      this.searchForm.page = val
      this.currentPage = val
      this.searchOrder()
    },
    // 进度查询
    scheduleSearch (row) {},
    // 用户查询工单
    searchOrder () {
      UserSearchOrder(this.searchForm)
        .then((data) => {
          debugger
          this.tableData = data.data.data.records
          this.total = data.data.total
          this.$message({
            message: '查询成功',
            type: 'success'
          })
        }).catch(error => {
          this.$message.error('查询失败')
          console.error('Error fetching data:', error)
        })
    },
    // 用户确认工单
    confirmOrder (row) {
      UserConfirmOrder(row.id)
        .then((data) => {
          this.$message({
            message: '确认工单成功',
            type: 'success'
          })
          this.searchOrder()
        }).catch(error => {
          console.error('Error fetching data:', error)
          this.$message.error('确认工单失败')
        })
    },
    // 用户取消工单
    cancelOrder (row) {
      console.log(row)
    },
    // 查看订单详情
    searchOrderInfo (id) {
      UserSearchOrder({
        id: id,
        page: 1,
        pageSize: 5
      })
        .then((data) => {
          this.orderInfo = data.data.data.records[0]
          this.showModal = true
          this.orderId = id
        }).catch(error => {
          console.error('Error fetching data:', error)
        })
    },
    // 关闭遮盖层
    closeModal () {
      this.showModal = false
    }
  }
}
</script>

<style lang="scss">
.page{
  .table-user-order{
    .table-my-order {
      .red-button {
        color: red; /* 设置文本颜色为红色 */
        background-color: transparent;
      }
      .green-button {
        color: lawngreen; /* 设置文本颜色为红色 */
        background-color: transparent;
      }
    }
  }
}
</style>
