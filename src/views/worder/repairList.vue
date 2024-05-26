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
              label="姓名">
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
                  {{ scope.row.statusInfo }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="300">
              <template slot-scope="scope">
                <el-button @click="searchOrderInfo(scope.row.id,scope.$index)" type="text">查看详情</el-button>
                <el-button v-if="scope.row.status===0" @click="acceptOrder(scope.row)" type="text">接单</el-button>
                <el-button v-if="scope.row.status!==0" @click="scheduleSearch(scope.row)" type="text">进度查询</el-button>
                <el-button v-if="scope.row.status===15" @click="repairOver(scope.row)" type="text">维修完毕</el-button>
                <el-button v-if="scope.row.status===15" @click="repairFail(scope.row)" type="text">维修失败</el-button>
                <el-button v-if="scope.row.status===13" @click="applyMaterial(scope.row.id)" type="text">申请材料</el-button>
                <el-button v-if="scope.row.status===2" @click="uploadFile(scope.row.id)" type="text">上传图片</el-button>
                <el-button v-if="scope.row.status===16" @click="ReInspectionSuccess(scope.row.id)" type="text">复检成功</el-button>
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
    <apply-ma :showMaterial="showMaterial" @closeModal="closeModal" :orderId="orderId"></apply-ma>
    <upload-file :showUpload="showUpload" :fileType="fileType" @closeModal="closeModal" :orderId="orderId"></upload-file>
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
      // 工单详情
      orderInfo: null,
      tableData: [],
      // 用于控制遮盖层
      showModal: false,
      // 用户查询工单详情
      orderId: '',
      // 用于控制申请材料表的遮盖层
      showMaterial: false,
      // 控制上传文件遮罩层
      showUpload: false,
      // 表示上传文件地类型
      fileType: ''
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
            message: '接单成功',
            type: 'success'
          })
          this.searchOrder()
        }).catch(error => {
          this.$message.error('接单失败')
          console.error('Error fetching data:', error)
        })
    },
    // 用户查询工单
    searchOrder () {
      WorkerSearchOrder(this.searchForm)
        .then((data) => {
          this.tableData = data.data.data.records
          this.total = data.data.data.total
          this.$message({
            message: '查询成功',
            type: 'success'
          })
        }).catch(error => {
          this.$message.error('查询失败')
          console.error('Error fetching data:', error)
        })
    },
    // 维修完毕
    repairOver () {},
    // 维修失败
    repairFail (id) {},
    // 进度查询
    scheduleSearch (row) {},
    // 查看订单详情
    searchOrderInfo (id, i) {
      this.showModal = true
      this.orderId = id
      this.orderInfo = this.tableData[i]
    },
    // 关闭工单详情的遮盖层
    closeModal () {
      this.showModal = false
      this.showMaterial = false
      this.showUpload = false
    },
    // 申请材料
    applyMaterial (id) {
      this.showMaterial = true
      this.orderId = id
    },
    // 复检成功----这里有这上传视频的功能
    ReInspectionSuccess (id) {
      this.orderId = id
      this.showUpload = true
      this.fileType = 'video'
    },
    // 上传图片文件
    uploadFile (id) {
      this.orderId = id
      this.showUpload = true
      this.fileType = 'image'
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
