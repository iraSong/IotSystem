<template>
  <!-- 修改密码弹框 -->
  <div class="qdDialog" v-if="showModifyPassword" @click="toggleDialog">
    <div  @click.stop class="dialog-main detail">
      <div class="dialog-title">
        <div class="name">修改密码</div>
        <div class="close" @click.stop="toggleDialog" />
      </div>
      <div class="dialog-content">
        <div class="dialog-item">
          <div class="label">旧密码</div>
          <input v-model="oldPassword" type="password" placeholder="" />

          <div class="valid">{{oldErr}}</div>
        </div>
        <div class="dialog-item">
          <div class="label">新密码</div>
          <input v-model="newPassword" type="password" placeholder="" />
          <div class="valid">{{newErr}}</div>
        </div>
        <div class="dialog-item">
          <div class="label">确认新密码</div>
          <input v-model="confirmPassword" type="password" placeholder="" />
          <div class="valid">{{confirmErr}}</div>
        </div>
      </div>

      <div class="footer">
        <button class="cancel" @click.stop="toggleDialog">取消</button>
        <button :class="[{'disable' :  !isPass}, 'confirm']" @click="submitModify">提交</button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations  } from 'vuex'
export default {
  data() {
    return {
      oldPassword:'',
      newPassword:'',
      confirmPassword:'',

      oldErr: '',
      newErr: '',
      confirmErr: '',
      isPass:false,
    }
  },
  computed: {
    ...mapState(['showModifyPassword'])
  },
  mounted() {
  },
  methods: {
    ...mapMutations(['toggleModifyPassword']),
    toggleDialog() {
      this.toggleModifyPassword()
    },
    reset() {
      this.oldPassword = ''
      this.newPassword = '',
      this.confirmPassword = ''
      this.oldErr = '',
      this.newErr = '',
      this.confirmErr = '',
      this.isPass = false
    },
    submitModify() {
      if(!this.isPass) return
      let userId = ''
      if(localStorage.getItem('Navigation')) {
        userId = JSON.parse(localStorage.getItem('Navigation')).jsonObject.id
      }
      this.$http({
        method:'post',
        url:'/api/json/authUserApi/modifyAuthUserPassword',
        data:{
          id: userId,
          newPassword: this.newPassword,
          oldPassword: this.oldPassword
        }
      })
        .then((res) => {
          console.log(res.data.result)
          if(res.data.result == '1001') {
            this.$Message.success('密码修改成功！请重新登入')
            //  密码修改成功
            setTimeout(() => {
              window.location.href = '/index.html'
            },2000)
          } else {
            this.$Message.error(res.msg || '密码修改失败')
          }
        })
        .catch((err) => {
          this.$Message.error(err.msg || '系统或网络错误')
        })
    },
    validIsPass() {
      return  this.oldErr.length == 0 && this.newErr.length == 0 && this.confirmErr.length == 0 && this.confirmPassword  && this.confirmPassword == this.newPassword 
    }
  },
  watch: {
    showModifyPassword(val) {
      if(val) {
        this.reset()
      }
    },
    oldPassword() {
      // 验证旧密码
      if(!this.oldPassword){
        this.oldErr = '旧密码不能为空'
        this.isPass = false
      } else {
        this.oldErr = ''
        this.isPass = this.validIsPass() 
      }
    },
    newPassword() {
      let reg1 =  /^[a-zA-Z0-9_-]{8,16}$/
      let reg2 =  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/

      // 验证新密码
      if(!this.newPassword){
        this.newErr = '新密码不能为空'
        this.isPass = false
      } else if(!reg1.test(this.newPassword)){
        this.newErr = '请使用8-16位数字字母'
        this.isPass = false
      } else if(!reg2.test(this.newPassword)) {
        this.newErr = '至少1个大写，1个小写和1个数字'
        this.isPass = false
      } else {
        this.newErr = ''
        this.isPass = this.validIsPass() 
      }
    },
    confirmPassword() {
      // 验证确认密码
      if(!this.confirmPassword){
        this.confirmErr = '请再次输入新密码'
        this.isPass = false
      } else if(this.confirmPassword != this.newPassword){
        this.confirmErr = '两次密码不一致'
        this.isPass = false
      } else {
        this.confirmErr = ''
        this.isPass = this.validIsPass() 
      }
    }
  },
}
</script>
<style lang="less" scoped>
.qdDialog{
  color:rgba(255,255,255,0.8);
  &::after{
    content: "";
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,16,31,0.8);
  }
  .dialog-main{
    position: absolute;
    top:50%;
    left:50%;
    z-index: 999;
    transform: translate(-50%, -50%);

    width: 433px;
    background:#1f3445;
    border-radius:2px;
    border:1px solid rgba(255,255,255,0.08);
    .dialog-title{
      background:#273c4e;
      .name{
        font-size: 14px;
        font-weight:600;
        text-align: center;
        padding: 17px 0;
      }
      .close{
        position: absolute;
        top: 20px;
        right: 24px;
        width: 14px;
        height: 15px;
        background: url("~@assets/img/demo/city/close.png");
        background-size: 100% 100%;
      }
    }
    .dialog-content{
      padding: 24px 12px;
      .dialog-item{
        position: relative;

        display: flex;
        text-align: center;
        border-radius:1px;

        margin: 0 12px 24px;
        
        .label{
          width: 113px;
        }
        input{
          flex:1;
          padding-left: 8px;
          font-size:14px;
          border:none;
          outline: none;
          height:32px;
          background:#273c4d;
          border-radius:2px;
          border:1px solid rgba(255,255,255,0.08);
          color:rgba(255,255,255,0.8);
        }

        .valid{
          font-size: 12px;
          position: absolute;
          top:32px;
          left:113px;
          color: #FF4646;
        }
      }
    }
  }
  .footer{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right:16px;
    font-size: 14px;

    margin-bottom: 32px;
    .cancel{
      outline:none;
      width: 64px;
      height: 32px;
      border-radius:2px;
      border:1px solid rgba(255,255,255,0.4);
      color:rgba(255,255,255,0.8);
      background: transparent;
      margin-right: 16px;
    }
    .confirm{
      outline:none;
      border: none;
      width: 64px;
      height: 32px;
      color:rgba(255,255,255,1);
      background:rgba(0,183,255,1);
      border-radius:2px;
      &.disable{
        color:rgba(255,255,255,0.3);
        background:rgba(0,183,255,0.3);
      }
    }
  }
}
</style>