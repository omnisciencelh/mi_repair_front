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
                <el-button v-if="scope.row.status!==0" @click="scheduleSearch(scope.row.id)" type="text">进度查询</el-button>
                <el-button v-if="scope.row.status===15" @click="repairOver(scope.row.id)" type="text">维修完毕</el-button>
                <el-button v-if="scope.row.status===15" @click="repairFail(scope.row.id)" type="text">维修失败</el-button>
                <el-button v-if="scope.row.status===13" @click="applyMaterial(scope.row.id)" type="text">申请材料</el-button>
                <el-button v-if="scope.row.status===2" @click="uploadFile(scope.row.id)" type="text">上传图片</el-button>
                <el-button v-if="scope.row.status===16" @click="ReInspectionSuccess(scope.row.id)" type="text">复检成功</el-button>
                <el-button v-if="scope.row.status===22" @click="returnDevice(scope.row.id)" type="text">归还设备</el-button>
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
    <apply-ma :showMaterial="showMaterial" @closeModal="closeModal" @upload="uploadSucc" :orderId="orderId"></apply-ma>
    <upload-file :showUpload="showUpload" :fileType="fileType" @closeModal="closeModal" @upload="uploadSucc" :orderId="orderId"></upload-file>
    <schedule :showSchedule="showSchedule" :activities="activities" @closeModal="closeModal" :orderId="orderId"></schedule>
  </d2-container>
</template>

<script>
import { WorkerAcceptOrder, WorkerSearchOrder, repairSuccess, repairFailed, returnDevice } from '@/api/comment/repairOrder'
import { getSchedule } from '@/api/comment/schedule'
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
      // 控制进度遮罩层
      showSchedule: false,
      // 表示上传文件地类型
      fileType: '',
      // 选择器值
      options: [
        {
          value: '25',
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
      ],
      // 进度详情
      activities: []
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
          this.tableData = data.data.records
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
    // 维修完毕
    repairOver (id) {
      repairSuccess(id)
        .then((data) => {
          this.searchOrder()
        }).catch(error => {
          this.$message.error('维修完毕失败啊')
          console.error('Error fetching data:', error)
        })
    },
    // 维修失败
    repairFail (id) {
      repairFailed(id)
        .then((data) => {
          this.searchOrder()
        }).catch(error => {
          this.$message.error('维修失败失败啊')
          console.error('Error fetching data:', error)
        })
    },
    // 进度查询
    scheduleSearch (id) {
      getSchedule({
        orderId: id,
        type: 1
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
      this.showSchedule = false
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
    },
    // 重置思索栏
    reset () {
      this.searchForm.status = ''
      this.searchForm.page = 1
      this.searchOrder()
    },
    // 返还设备
    returnDevice (id) {
      returnDevice(id)
        .then((data) => {
          this.$message({
            message: '返还设备成功',
            type: 'success'
          })
          this.searchOrder()
        }).catch(error => {
          this.$message.error('返还设备失败')
          console.error('Error fetching data:', error)
        })
    },
    // 上传文件完毕
    uploadSucc () {
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
          font-weight: bolder;
        }
      }
    }
    .box-card {
      background: #4EFFFB;
    }
  }
</style>
