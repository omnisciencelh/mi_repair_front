<template>

    <div class="page-order">
      <div class="page-order--form">
        <el-card shadow="never">
          <el-form :label-position="labelPosition" :model="repairOrder" :rules="rules" ref="repairForm" label-width="80px">
            <h2 style="text-align: center">售后维修订单申请表</h2>
            <el-form-item label="用户名称" prop="userName">
              <el-input v-model="repairOrder.userName" placeholder="请输入用户昵称"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="userNumber">
              <el-input v-model="repairOrder.userNumber" placeholder="请输入电话号码"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="userAddr">
              <el-input v-model="repairOrder.userAddr" placeholder="请输入用户地址"></el-input>
            </el-form-item>
            <el-form-item label="商品信息" prop="goodsInfo">
              <el-input v-model="repairOrder.goodsInfo" placeholder="请输入商品信息"></el-input>
            </el-form-item>
            <el-form-item label="sn信息" prop="sn">
              <el-input v-model="repairOrder.sn" placeholder="请输sn信息"></el-input>
            </el-form-item>
            <el-form-item label="故障描述" prop="desc">
              <el-input type="textarea" v-model="repairOrder.desc" placeholder="请输入故障描述"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                size="default"
                @click="submitForm"
                type="primary"
                class="button-submit">
                提交
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>

</template>

<script>
import { UserRepairOrder } from '@/api/comment/repairOrder'
export default {
  name: 'userOrder',
  data () {
    return {
      labelPosition: 'right',
      repairOrder: {
        userName: '',
        userNumber: '',
        userAddr: '',
        goodsInfo: '',
        sn: '',
        desc: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        userNumber: [
          { required: true, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        userAddr: [
          { required: true, message: '请输入用户地址', trigger: 'blur' },
          { min: 1, message: '请输入用户地址', trigger: 'blur' }
        ],
        sn: [
          { required: true, message: '请至少选择一个sn信息', trigger: 'change' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs.repairForm.validate((valid) => {
        const phoneRegex = /^1[3-9]\d{9}$/
        const phone = this.repairOrder.userNumber
        if (!phoneRegex.test(phone)) {
          this.$message.error('手机号格式不正确')
          return false
        }
        if (valid) {
          UserRepairOrder(this.repairOrder)
            .then((data) => {
              this.$message({
                message: data.data.msg,
                type: 'success'
              })
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss">
.page-order{
  @extend %unable-select;
  height: 100%;
  display: grid;
  place-items: center;
  //卡片
  .el-card {
    /*margin-bottom: 15px;*/
  }
  //表单
  .page-order--form {
    width: 500px;
    background: white;
  }
  //提交按钮
  // 登录按钮
  .button-submit {
    width: 100%;
  }
}
</style>
