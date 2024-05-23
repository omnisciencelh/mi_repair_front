<template>
  <div class="modal" v-show="showModal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2 style="text-align: center;">工单详情表</h2>
      <el-descriptions direction="vertical" :column="4" border>
        <el-descriptions-item label="用户">{{orderInfo.userName }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{orderInfo.userNumber }}</el-descriptions-item>
        <el-descriptions-item label="sn信息">{{orderInfo.sn }}</el-descriptions-item>
        <el-descriptions-item label="工单状态">{{orderInfo.statusInfo }}</el-descriptions-item>
        <el-descriptions-item label="商品信息"  :span="2">{{orderInfo.goodsInfo }}</el-descriptions-item>
        <el-descriptions-item label="联系地址"  :span="2">{{orderInfo.userAddr }}</el-descriptions-item>
        <el-descriptions-item label="故障描述"  :span="4">{{orderInfo.desc }}</el-descriptions-item>
      </el-descriptions>
      <el-row class="scroll-container">
        <el-col :span="300" v-for="url in urls" :key="url">
          <el-image class="img" :src="url"></el-image>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { WorkerSearchOrder } from '@/api/comment/repairOrder'
export default {
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      orderInfo: {
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
      urls: [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
        'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
        'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
        'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
        'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
      ],
      searchForm: {
        orderId: '',
        status: '',
        page: 1,
        pageSize: 5
      }
    }
  },
  created () {
    this.searchOrder()
  },
  methods: {
    // 关闭遮盖层
    closeModal () {
      this.showModal = false
      //  如果需要，可以触发一个事件来通知父组件模态框已关闭
      this.$emit('closeModal')
    },
    // 查询工单
    searchOrder () {
      debugger
      this.searchForm.orderId = this.orderId
      WorkerSearchOrder(this.searchForm)
        .then((data) => {
          this.orderInfo = this.data.data.records[0]
        }).catch(error => {
        // TODO 需要完善
          console.error('Error fetching data:', error)
        })
    }
  }
}
</script>

<style scoped>
  .modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
    z-index: 9998; /* 确保z-index比其他元素高 */
  }

  .modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 40%; /* 或指定一个固定的宽度 */
  }

  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }

  .scroll-container {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
  }
  .img {
    max-width: 100%; /* 图片最大宽度为列宽 */
    height: auto; /* 图片高度自动 */
  }
</style>
