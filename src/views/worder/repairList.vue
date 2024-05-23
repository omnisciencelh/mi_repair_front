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
            @current-change="handleCurrentChange"
            style="width: 100%">
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              property="userName"
              label="姓名"
              width="60">
            </el-table-column>
            <el-table-column
              property="userNumber"
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
              property="desc"
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
                  {{ scope.row.statusInfo }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="300">
              <template slot-scope="scope">
                <el-button @click="searchOrderInfo(scope.row.id)" type="text">查看详情</el-button>
                <el-button v-if="scope.row.status===0" @click="acceptOrder(scope.row)" type="text">接单</el-button>
                <el-button v-if="scope.row.status!==0" @click="scheduleSearch(scope.row)" type="text">进度查询</el-button>
                <el-button v-if="scope.row.status===15" @click="repairOver(scope.row)" type="text">维修完毕</el-button>
                <el-button v-if="scope.row.status===15" @click="repairFail(scope.row)" type="text">维修失败</el-button>
                <el-button v-if="scope.row.status===2" @click="repairFail(scope.row)" type="text">申请材料</el-button>
                <el-button v-if="scope.row.status===16" @click="ReInspectionSuccess(scope.row)" type="text">复检成功</el-button>
<!--                <el-button v-if="scope.row.status===3" type="text" class="red-button">用户已取消工单</el-button>-->
<!--                <el-button v-if="scope.row.status===17" type="text" class="red-button">维修失败</el-button>-->
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
    <order-info :showModal="showModal" @closeModal="closeModal" :orderId="orderId"></order-info>
  </d2-container>
</template>

<script>
import { WorkerAcceptOrder, WorkerSearchOrder } from '@/api/comment/repairOrder'
export default {
  name: 'repairList',
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
        userName: '肖战',
        userNumber: '110',
        userAddr: '花果山水帘洞',
        goodsInfo: '不知道',
        sn: 'asdasdsd',
        desc: '就是死了',
        status: 0,
        statusInfo: '待用户确认',
        createTime: '2024-05-16 10:32'
      },
      {
        id: '',
        userName: '肖战',
        userNumber: '110',
        userAddr: '花果山水帘洞',
        goodsInfo: '不知道',
        sn: 'asdasdsd',
        desc: '就是死了',
        status: 15,
        statusInfo: '维修完毕',
        createTime: '2024-05-16 10:32'
      },
      {
        id: '',
        userName: '肖战',
        userNumber: '110',
        userAddr: '花果山水帘洞',
        goodsInfo: '不知道',
        sn: 'asdasdsd',
        desc: '就是死了',
        status: 2,
        statusInfo: '申请材料',
        createTime: '2024-05-16 10:32'
      },
      {
        id: '',
        userName: '肖战',
        userNumber: '110',
        userAddr: '花果山水帘洞',
        goodsInfo: '不知道',
        sn: 'asdasdsd',
        desc: '就是死了',
        status: 3,
        statusInfo: '用户已取消工单',
        createTime: '2024-05-16 10:32'
      },
      {
        id: '',
        userName: '肖战',
        userNumber: '110',
        userAddr: '花果山水帘洞',
        goodsInfo: '不知道',
        sn: 'asdasdsd',
        desc: '就是死了',
        status: 16,
        statusInfo: '复检成功',
        createTime: '2024-05-16 10:32'
      },
      {
        id: '',
        userName: '肖战',
        userNumber: '110',
        userAddr: '花果山水帘洞',
        goodsInfo: '不知道',
        sn: 'asdasdsd',
        desc: '就是死了',
        status: 17,
        statusInfo: '维修失败',
        createTime: '2024-05-16 10:32'
      }
      ],
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
    // 工程师接单
    acceptOrder (row) {
      WorkerAcceptOrder(row.id)
        .then((data) => {
          this.$message({
            message: data.data.msg,
            type: 'success'
          })
        }).catch(error => {
        // TODO 需要完善
          console.error('Error fetching data:', error)
        })
    },
    // 用户查询工单
    searchOrder () {
      WorkerSearchOrder(this.searchForm)
        .then((data) => {
          this.tableData = this.data.data.records
          this.total = this.data.data.total
        }).catch(error => {
        // TODO 需要完善
          console.error('Error fetching data:', error)
        })
    },
    // 维修完毕
    repairOver () {},
    // 维修失败
    repairFail () {},
    // 复检成功
    ReInspectionSuccess () {},
    // 进度查询
    scheduleSearch (row) {},
    // 查看订单详情
    searchOrderInfo (id) {
      this.showModal = true
      this.orderId = id
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
          font-weight: bolder;
        }
      }
    }
    .box-card {
      background: #4EFFFB;
    }
  }
</style>
