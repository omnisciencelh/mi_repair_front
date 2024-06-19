<template>
  <d2-container class="page">
    <h1 style="text-align: center">我的消息</h1>
    <el-main>
      <div class="table-my-order">
        <el-table
          :data="tableData"
          border
          style="width: 100%; margin-top: 20px">
          <el-table-column
            prop="message"
            label="消息"
            width="180">
          </el-table-column>
          <el-table-column
            prop="orderId"
            label="订单号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="date"
            label="时间"
            width="180">
          </el-table-column>
        </el-table>
      </div>
    </el-main>
    <el-footer style="text-align: center">
      <el-button type="primary"  @click="clear">清空消息</el-button>
    </el-footer>
  </d2-container>
</template>

<script>
import util from '@/libs/util'
export default {
  mounted () {
    this.loadTableDataFromLocalStorage()
    this.initWebSocket()
    window.addEventListener('onmessageWS', this.getSocketData)
  },
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    saveTableDataToLocalStorage () {
      const userId = util.cookies.get('uuid')
      const role = util.cookies.get('role')
      const tableDataString = JSON.stringify(this.tableData) // 将数组转换为字符串
      if (role === 0 || role === '0') {
        localStorage.setItem('user:' + userId, tableDataString)
      } else {
        localStorage.setItem('worker:' + userId, tableDataString)
      }
    },
    loadTableDataFromLocalStorage () {
      const role = util.cookies.get('role')
      const userId = util.cookies.get('uuid')
      var key = ''
      if (role === 0 || role === '0') {
        key = 'user:' + userId
      } else {
        key = 'worker:' + userId
      }
      const tableDataString = localStorage.getItem(key)
      if (tableDataString) {
        this.tableData = JSON.parse(tableDataString)
      } else {
        this.tableData = []
      }
    },
    clear () {
      const userId = util.cookies.get('uuid')
      const role = util.cookies.get('role')
      this.tableData = []
      const tableDataString = JSON.stringify(this.tableData)
      if (role === 0 || role === '0') {
        localStorage.setItem('user:' + userId, tableDataString)
      } else {
        localStorage.setItem('worker:' + userId, tableDataString)
      }
    },
    initWebSocket () {
      this.$websocket.initWebSocket()
    },
    getSocketData (res) {
      console.log(res)
      console.log('客户端送来的数据：')
      console.log(res.detail.data.message)
      var message = res.detail.data.message
      var obj = {
        message: message,
        date: res.detail.data.date,
        orderId: res.detail.data.orderId
      }
      this.tableData.push(obj)
      this.saveTableDataToLocalStorage()
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  .logo {
    width: 120px;
  }
  .btn-group {
    color: $color-text-placehoder;
    font-size: 12px;
    line-height: 12px;
    margin-top: 0px;
    margin-bottom: 20px;
    .btn-group__btn {
      color: $color-text-sub;
      &:hover {
        color: $color-text-main;
      }
      &.btn-group__btn--link {
        color: $color-primary;
      }
    }
  }
}
</style>
