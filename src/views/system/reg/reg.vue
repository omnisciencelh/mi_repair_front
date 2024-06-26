<template>
  <div class="page-login">
    <div class="page-login--layer page-login--layer-area">
      <ul class="circles">
        <li v-for="n in 10" :key="n"></li>
      </ul>
    </div>
    <div
      class="page-login--layer page-login--layer-time"
      flex="main:center cross:center">
      {{time}}
    </div>
    <div class="page-login--layer">
      <div
        class="page-login--content"
        flex="dir:top main:justify cross:stretch box:justify">
        <div class="page-login--content-header">
          <p class="page-login--content-header-motto">
            时间是一切财富中最宝贵的财富
          </p>
        </div>
        <div
          class="page-login--content-main"
          flex="dir:top main:center cross:center">
          <!-- logo -->
          <div class="logo">
            <img class="page-login--logo" src="./image/xiaomi.png">
            <span class="page-login--text">小米售后服务系统</span>
          </div>
          <!-- form -->
          <div class="page-reg--form">
            <el-card shadow="never">
              <el-form
                ref="formReg"
                label-position="top"
                :rules="rules"
                :model="formReg"
                size="default">
                <el-form-item>
                  <el-select class="mySwitch" v-model="isWorder" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="userName">
                  <el-input
                    type="text"
                    v-model="formReg.userName"
                    placeholder="登录账户">
                  </el-input>
                </el-form-item>
                <el-form-item prop="name">
                  <el-input
                    type="text"
                    v-model="formReg.name"
                    placeholder="姓名">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-input
                    type="text"
                    v-model="formReg.phone"
                    placeholder="手机号">
                  </el-input>
                </el-form-item>
                <el-form-item prop="username" v-if="!isWorder">
                  <el-input
                    type="text"
                    v-model="formReg.address"
                    placeholder="地址">
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    type="password"
                    v-model="formReg.password"
                    placeholder="密码">
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    type="password"
                    v-model="confirmPassword"
                    placeholder="确认密码">
                  </el-input>
                </el-form-item>
                <el-button
                  size="default"
                  @click="submit"
                  type="primary"
                  class="button-login">
                  注册
                </el-button>
              </el-form>
            </el-card>
            <p
              class="page-login--options"
              flex="main:justify cross:center">
              <router-link to="/login" tag="span">用户登录</router-link>
            </p>
            <!-- quick login -->
          </div>
        </div>
        <div class="page-login--content-footer">
          <p class="page-login--content-footer-locales">
            <a
              v-for="language in $languages"
              :key="language.value"
              @click="onChangeLocale(language.value)">
              {{ language.label }}
            </a>
          </p>
          <p class="page-login--content-footer-copyright">
            Copyright
            <d2-icon name="copyright"/>
           小米售后系统
            <a href="https://github.com/FairyEver">
              @FairyEver
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import router from '@/router'
import { mapActions } from 'vuex'
import localeMixin from '@/locales/mixin.js'
import { register } from '@/api/comment/login'
import { WorkerReg } from '@/api/comment/workerLogin'
export default {
  mixins: [
    localeMixin
  ],
  data () {
    return {
      isWorder: true,
      timeInterval: null,
      time: dayjs().format('HH:mm:ss'),
      // 确认密码
      confirmPassword: '',
      // 表单
      formReg: {
        username: '',
        password: '',
        name: '',
        address: '',
        phone: ''
      },
      // 表单校验
      rules: {
        name: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 用于登录
      options: [
        {
          value: false,
          label: '普通用户注册'
        }, {
          value: true,
          label: '工程师注册'
        }
      ]
    }
  },
  mounted () {
    this.timeInterval = setInterval(() => {
      this.refreshTime()
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timeInterval)
  },
  methods: {
    ...mapActions('d2admin/account', [
      'login'
    ]),
    refreshTime () {
      this.time = dayjs().format('HH:mm:ss')
    },
    /**
     * @description 提交表单
     */
    // 提交登录信息
    submit () {
      if (this.formReg.password !== this.confirmPassword) {
        this.$message.error('两次密码不一致')
        return
      }
      const phoneRegex = /^1[3-9]\d{9}$/
      if (!phoneRegex.test(this.formReg.phone)) {
        this.$message.error('手机号格式不正确')
        return
      }
      // 最后一关验证
      this.$refs.formReg.validate((valid) => {
        if (valid) {
          if (this.isWorder) {
            WorkerReg({
              name: this.formReg.name,
              workerName: this.formReg.userName,
              password: this.formReg.password,
              phone: this.formReg.phone
            })
              .then((data) => {
                router.push({ name: 'login' })
              })
          } else {
            register({
              name: this.formReg.name,
              userName: this.formReg.userName,
              password: this.formReg.password,
              phone: this.formReg.phone,
              addr: this.formReg.address
            })
              .then((data) => {
                router.push({ name: 'login' })
              })
          }
        } else {
          // 登录表单校验失败
          this.$message.error('表单校验失败，请检查')
        }
      })
    }
  }
}
</script>

<style lang="scss">
.page-login {
  @extend %unable-select;
  $backgroundColor: #F0F2F5;
   background-image: url('./image/xiaomi2.webp');
  // ---
  background-color: $backgroundColor;
  height: 100%;
  position: relative;
  // 层
  .page-login--layer {
    @extend %full;
    overflow: auto;
  }
  .page-login--layer-area {
    overflow: hidden;
  }
  // 时间
  .page-login--layer-time {
    font-size: 24em;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.07);
    overflow: hidden;
  }
  // 登陆页面控件的容器
  .page-login--content {
    height: 100%;
    min-height: 500px;
  }
  // header
  .page-login--content-header {
    padding: 1em 0;
    .page-login--content-header-motto {
      margin: 0px;
      padding: 0px;
      color: $color-text-normal;
      text-align: center;
      font-size: 12px;
    }
  }
  // main
  .logo {
      width: 280px;
      display: flex;
      align-items: center; /* 垂直居中对齐子元素 */
      justify-content: space-around; /* 水平方向上子元素分布在两端 */
      margin-top: -2em;
      margin-bottom: 2em;
    .page-login--logo {
      width: 60px;
      /*margin-bottom: 2em;*/
      /*margin-top: -2em;*/
    }
    .page-login--text {
        /* 设置文字的行高与图片高度大致相等，这可能需要你手动调整 */
        line-height: 40px; /* 假设图片的高度大约是 40px */
        vertical-align: top; /* 与图片顶部对齐（虽然在这个 flex 布局中可能不需要）*/
        color: white;
        font-size: 20px;
         font-weight: bold; /* 设置文本加粗 */
      }
  }
  // 登录表单
  .page-reg--form {
    width: 350px;
    //
    .mySwitch {
      display: flex;
      align-items: center; /* 垂直居中对齐子元素 */
      justify-content: space-around;
    }
    // 卡片
    .el-card {
      margin-bottom: 15px;
    }
    .myTexts {
      /*line-height: 40px; !* 假设图片的高度大约是 40px *!*/
      /*vertical-align: top; !* 与图片顶部对齐（虽然在这个 flex 布局中可能不需要）*!*/
      color: black;
      font-size: 20px;
      font-weight: bold;
    }
    // 登录按钮
    .button-login {
      width: 100%;
    }
    // 输入框左边的图表区域缩窄
    .el-input-group__prepend {
      padding: 0px 14px;
    }
    .login-code {
      height: 40px - 2px;
      display: block;
      margin: 0px -20px;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    }
    // 登陆选项
    .page-login--options {
      margin: 0px;
      padding: 0px;
      font-size: 14px;
      color: $color-primary;
      margin-bottom: 15px;
      font-weight: bold;
      display: flex;
      align-items: center; /* 垂直居中对齐子元素 */
      justify-content: space-around;
    }
    .page-login--quick {
      width: 100%;
    }
  }
  // 快速选择用户面板
  .page-login--quick-user {
    @extend %flex-center-col;
    padding: 10px 0px;
    border-radius: 4px;
    &:hover {
      background-color: $color-bg;
      i {
        color: $color-text-normal;
      }
      span {
        color: $color-text-normal;
      }
    }
    i {
      font-size: 36px;
      color: $color-text-sub;
    }
    span {
      font-size: 12px;
      margin-top: 10px;
      color: $color-text-sub;
    }
  }
  // footer
  .page-login--content-footer {
    padding: 1em 0;
    .page-login--content-footer-locales {
      padding: 0px;
      margin: 0px;
      margin-bottom: 15px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      color: $color-text-normal;
      a {
        color: $color-text-normal;
        margin: 0 .5em;
        &:hover {
          color: $color-text-main;
        }
      }
    }
    .page-login--content-footer-copyright {
      padding: 0px;
      margin: 0px;
      margin-bottom: 10px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      color: $color-text-normal;
      a {
        color: $color-text-normal;
      }
    }
    .page-login--content-footer-options {
      padding: 0px;
      margin: 0px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      a {
        color: $color-text-normal;
        margin: 0 1em;
      }
    }
  }
  // 背景
  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0px;
    padding: 0px;
    li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: #FFF;
      animation: animate 25s linear infinite;
      bottom: -200px;
      @keyframes animate {
        0%{
          transform: translateY(0) rotate(0deg);
          opacity: 1;
          border-radius: 0;
        }
        100%{
          transform: translateY(-1000px) rotate(720deg);
          opacity: 0;
          border-radius: 50%;
        }
      }
      &:nth-child(1) {
        left: 15%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        left: 5%;
        width: 20px;
        height: 20px;
        animation-delay: 2s;
        animation-duration: 12s;
      }
      &:nth-child(3) {
        left: 70%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
        animation-duration: 18s;
      }
      &:nth-child(5) {
        left: 65%;
        width: 20px;
        height: 20px;
        animation-delay: 0s;
      }
      &:nth-child(6) {
        left: 75%;
        width: 150px;
        height: 150px;
        animation-delay: 3s;
      }
      &:nth-child(7) {
        left: 35%;
        width: 200px;
        height: 200px;
        animation-delay: 7s;
      }
      &:nth-child(8) {
        left: 50%;
        width: 25px;
        height: 25px;
        animation-delay: 15s;
        animation-duration: 45s;
      }
      &:nth-child(9) {
        left: 20%;
        width: 15px;
        height: 15px;
        animation-delay: 2s;
        animation-duration: 35s;
      }
      &:nth-child(10) {
        left: 85%;
        width: 150px;
        height: 150px;
        animation-delay: 0s;
        animation-duration: 11s;
      }
    }
  }
}
</style>
