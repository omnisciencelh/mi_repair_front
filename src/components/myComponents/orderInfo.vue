<template>
  <div class="modal" v-show="showModal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2 style="text-align: center;">工单详情表</h2>
      <el-descriptions direction="vertical" :column="4" border>
        <el-descriptions-item label="用户">{{orderInfo.userName }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{orderInfo.userPhone }}</el-descriptions-item>
        <el-descriptions-item label="sn信息">{{orderInfo.sn }}</el-descriptions-item>
        <el-descriptions-item label="工单状态">{{orderInfo.statusInfo }}</el-descriptions-item>
        <el-descriptions-item label="商品信息"  :span="2">{{orderInfo.goodsInfo }}</el-descriptions-item>
        <el-descriptions-item label="联系地址"  :span="2">{{orderInfo.userAddr }}</el-descriptions-item>
        <el-descriptions-item label="故障描述"  :span="4">{{orderInfo.description }}</el-descriptions-item>
      </el-descriptions>
      <div style="display: flex;justify-content: center">
        <el-row class="container">
          <el-col v-show="showImage" :span="300" v-for="url in urls" :key="url">
            <el-image style="width: 100px; height: 100px" fit="cover" class="img" :src="url.path"></el-image>
          </el-col>
        </el-row>
        <el-row v-show="!showImage">
          <el-button type="primary" round @click="showImg">查看故障图片</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { preview } from '@/api/comment/file'
export default {
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    // 是用户还是工程师在查询
    isUser: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: String,
      default: ''
    },
    orderInfo: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      urls: [],
      showImage: false
    }
  },
  methods: {
    // 关闭遮盖层
    closeModal () {
      this.showImage = false
      this.$emit('closeModal')
    },
    // 查询工单
    searchOrder () {
      this.searchForm.orderId = this.orderId
    },
    showImg () {
      this.showImage = true
      preview(this.orderId)
        .then((data) => {
          this.urls = data.data
        }).catch(error => {
          this.$message.error('图片查询失败')
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
    z-index: 10; /* 确保z-index比其他元素高 */
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

  .container {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
  }
  .img {
    max-width: 100%; /* 图片最大宽度为列宽 */
    height: auto; /* 图片高度自动 */
  }
</style>
