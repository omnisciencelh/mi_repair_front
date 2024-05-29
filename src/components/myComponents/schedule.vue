<template>
  <div class="modal" v-show="showSchedule">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2 style="text-align: center;">进度表</h2>
      <div class="container">
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :color="color"
            :timestamp="activity.createTime">
            {{activity.statusInfo}}
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showSchedule: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: String,
      default: ''
    },
    activities: []
  },
  data () {
    return {
      // activities: [{
      //   content: '活动按期开始',
      //   timestamp: '2018-04-15'
      // }, {
      //   content: '通过审核',
      //   timestamp: '2018-04-13'
      // }, {
      //   content: '创建成功',
      //   timestamp: '2018-04-11'
      // }],
      color: '#0bbd87'
    }
  },
  methods: {
    // 关闭遮盖层
    closeModal () {
      this.$emit('closeModal')
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
    width: 30%; /* 或指定一个固定的宽度 */
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
    display: flex; /* 设置为弹性容器 */
    justify-content: center; /* 水平居中（可选） */
    align-items: stretch; /* 垂直方向拉伸（默认） */
  }
</style>
