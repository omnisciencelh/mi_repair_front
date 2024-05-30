<template>
  <d2-container class="page">
    <el-container class="table-user-order">
      <el-header>
        <div class="search">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item label="工单状态">
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
              <el-button type="primary" icon="el-icon-search" @click="searchOrder">搜索</el-button>
              <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
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
                <el-button @click="scheduleSearch(scope.row.id)" type="text">进度查询</el-button>
                <el-button v-if="scope.row.status===1" @click="confirmOrder(scope.row)" type="text">确认工单</el-button>
                <el-button v-if="scope.row.status===0 || scope.row.status===1  || scope.row.status===14" @click="cancelOrder(scope.row)" type="text">取消工单</el-button>
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
import { getSchedule } from '@/api/comment/schedule'
import { UserSearchOrder, UserConfirmOrder, UserCancelOrder } from '@/api/comment/repairOrder'
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
      // 用于控制进度表遮罩层
      showSchedule: false,
      // 用于存储某个order的进度
      activities: [],
      // 用户查询工单详情
      orderId: '',
      // 选择器值
      options: [
        {
          value: '0',
          label: '等待工程师接单'
        }, {
          value: '1',
          label: '等待用户确认'
        }, {
          value: '2',
          label: '用户已确认'
        }, {
          value: '3',
          label: '用户已取消确认'
        }, {
          value: '13',
          label: '申请材料'
        }, {
          value: '14',
          label: '等待材料'
        }, {
          value: '15',
          label: '维修'
        }, {
          value: '16',
          label: '复检'
        }, {
          value: '17',
          label: '维修失败'
        }, {
          value: '21',
          label: '等待支付'
        }, {
          value: '22',
          label: '已支付'
        }, {
          value: '24',
          label: '已完成'
        }
      ]
    }
  },
  created () {
    this.searchOrder()
  },
  methods: {
    // 分页查询
    currentPageChange (val) {
      if ((val * this.pageSize - (this.pageSize - 1)) <= this.total) {
        this.searchForm.page = val
        this.currentPage = val
        this.searchOrder()
      } else {
        this.$message({
          message: '已展示全部数据',
          type: 'warning'
        })
      }
    },
    // 进度查询
    scheduleSearch (id) {
      getSchedule({
        orderId: id,
        type: 0
      })
        .then((data) => {
          this.orderId = id
          this.showSchedule = true
          this.activities = data.data.records
        }).catch(error => {
          this.$message.error('查询失败')
          console.error('Error fetching data:', error)
        })
    },
    // 用户查询工单
    searchOrder () {
      UserSearchOrder(this.searchForm)
        .then((data) => {
          this.tableData = data.data.records
          this.total = data.data.total
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
      UserCancelOrder(row.id)
        .then((data) => {
          this.$message({
            message: '取消工单成功',
            type: 'success'
          })
          this.searchOrder()
        }).catch(error => {
          console.error('Error fetching data:', error)
          this.$message.error('取消工单失败')
        })
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
          this.orderInfo = data.data.records[0]
          this.showModal = true
          this.orderId = id
        }).catch(error => {
          console.error('Error fetching data:', error)
        })
    },
    // 关闭遮盖层
    closeModal () {
      this.showSchedule = false
      this.showModal = false
    },
    // 重置思索栏
    reset () {
      this.searchForm.status = ''
      this.searchForm.page = 1
      this.searchOrder()
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
