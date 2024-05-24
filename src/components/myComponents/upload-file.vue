<template>
  <div class="modal" v-show="showUpload">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2 style="text-align: center;">上传文件</h2>
      <div v-if="fileType==='image'" style="display: flex;justify-content: center; ">
        <el-upload
          action="#"
          list-type="picture-card"
          :on-change="handleFileChange"
          :auto-upload="false">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url" alt=""
            >
            <span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-preview"
          @click="handlePictureCardPreview(file)"
        >
          <i class="el-icon-zoom-in"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleRemove(file)"
        >
          <i class="el-icon-delete"></i>
        </span>
      </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
      <div v-if="fileType === 'video'" style="display: flex;justify-content: center; ">
        <el-upload
        class="upload-demo"
        drag
        action="#"
        :on-change="handleFileChange"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showUpload: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: String,
      default: ''
    },
    fileType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileList: []
    }
  },
  created () {
  },
  methods: {
    // 关闭遮盖层
    closeModal () {
      this.$emit('closeModal')
    },
    handleRemove (file) {
      console.log(file)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 上传图片
    upload () {

    },
    // 我的图片列表
    handleFileChange (file, fileList) {
      // debugger
      // 当选择文件后，将文件添加到 fileList 数组中
      // this.fileList = fileList.map(file => ({
      //   ...file
      // }))
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
