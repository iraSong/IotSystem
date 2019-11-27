<template>
  <div v-show="showLogin"
    class="login"
    @click.self="showLogin = false">
    <div class="register-form">
      <div class="sub-title flex-center"><img class="logo" src="~@assets/img/logo.png"/> 千丁·星宸</div>
      <input type="text"
        v-model="userInfo.account"
        placeholder="账号" />
      <input type="text"
        v-model="userInfo.password"
        placeholder="密码" />

      <button @click="dologin" :disabled="!isPass" :class="[{disable: !isPass}, 'submit']" >登录</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showLogin: false,
      isPass: false,
      userInfo: {
        account: '',
        password: ''
      }
    }
  },
  mounted() {
  },
  methods: {
    dologin() {
      if(!this.isPass) return
      console.log('login')
      this.$Message.success('登录成功！')
      this.showLogin = false
    },
    valid() {
      if(!this.userInfo.account || !this.userInfo.password) {
        this.isPass = false
      } else {
        this.isPass = true
      }
    }
  },
  watch: {
    'userInfo.account': function(){
      this.valid()
    },
    'userInfo.password': function(){
      this.valid()
    },
  }
}
</script>

<style lang="less" scoped>
.login {
  position: fixed;
  z-index: 9;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  background: rgba(0, 0, 0, 0.3);

  .register-form {
    max-height: 100%;
    overflow: visible;
    font-size: 12px;
    position: absolute;
    width: 464px;
    background: #fff;

    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 15px;

    padding: 30px 75px;
    input,
    button,
    select {
      font-size: 14px;
      outline: none;
      border: none;
      height: 40px;
      width: 100%;
      margin-bottom: 24px;
      padding-left: 10px;
      border:1px solid rgba(0,0,0,0.2);
      box-sizing: border-box;
      &::-webkit-input-placeholder {
        color: #c5c8ce;
      }
    }
    .sub-title {
      margin-bottom: 26px;
      font-size: 24px;
      color:rgba(0,0,0,0.6);
      .logo{
        width: 36px;
        height: 36px;
        margin-right: 14px;
      }
    }


    .submit{
      height: 40px;
      width: 100%;
      margin-top: 16px;
      background:rgba(0,134,255,1);
      border-radius:2px;

      font-size: 16px;
      color:rgba(255,255,255,1);
      border: none;
      &.disable{
        background:rgba(0,134,255,0.3);
      }
    }
  }
  .ivu-select {
    margin-bottom: 10px;
  }
}
</style>