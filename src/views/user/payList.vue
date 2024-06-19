<template>
  <d2-container class="page">
    <el-container class="table-user-pay">
      <el-header>
        <div class="search">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item label="支付状态">
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
              <el-button type="primary" icon="el-icon-search" @click="searchPay">搜索</el-button>
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
              property="orderId"
              label="订单号"
              width="150">
            </el-table-column>
            <el-table-column
              property="price"
              label="价格">
            </el-table-column>
            <el-table-column
              property="statusInfo"
              label="支付状态">
              <template slot-scope="scope">
                <span :class="{ 'red-button': scope.row.status === 0 }">
                  {{ scope.row.statusInfo }}
                </span>
              </template>
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
                <el-button @click="searchOrderInfo(scope.row.orderId)" type="text">查看工单</el-button>
                <el-button v-if="scope.row.status===0" @click="payment(scope.row)" type="text">去支付</el-button>
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
import { UserSearchOrderPay, UserPay } from '@/api/comment/orderPay.js'
import { UserSearchOrder } from '@/api/comment/repairOrder'

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
      tableData: [],
      // 选择器
      options: [
        {
          value: '0',
          label: '待支付'
        }, {
          value: '1',
          label: '已支付'
        }
      ],
      // 用于控制遮盖层
      showModal: false,
      // 用户查询工单详情
      orderId: '',
      // 传给子组件的维修工单
      orderInfo: null
    }
  },
  created () {
    this.searchPay()
  },
  methods: {
    // 分页查询
    currentPageChange (val) {
      if ((val * 5 - 4) <= this.total) {
        this.searchForm.page = val
        this.currentPage = val
        this.searchPay()
      } else {
        this.$message({
          message: '已展示全部数据',
          type: 'warning'
        })
      }
    },
    // 进度查询
    scheduleSearch (row) {},
    // 用户查询支付流水
    searchPay () {
      UserSearchOrderPay(this.searchForm)
        .then((data) => {
          this.tableData = data.data.records
          this.total = data.data.total
        }).catch(error => {
          this.$message.error('查询失败')
          console.error('Error fetching data:', error)
        })
    },
    // 用户支付支付
    payment (data) {
      UserPay(data)
        .then((data) => {
          let aliPay
          aliPay = window.open()
          aliPay.document.open()
          let dataObj = data
          aliPay.document.write("<html><head><title></title><meta charset='utf-8'><body>"+ dataObj +"</body></html>")
          aliPay.document.forms[0].submit()
          aliPay.document.close()
          this.$message.success('前往充值中...')
        }).catch(error => {
          this.$message.error('支付失败')
          console.error('Error fetching data:', error)
        })
    },
    // 重置思索栏
    reset () {
      this.searchForm.status = ''
      this.searchForm.page = 1
      this.searchPay()
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
      this.showModal = false
    }
  }
}
</script>

<style lang="scss">
.table-user-pay{
  .red-button {
    color: red; /* 设置文本颜色为红色 */
    background-color: transparent;
    font-weight: 900;
    font-size: larger;
  }
}
</style>
