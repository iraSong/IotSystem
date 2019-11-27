<template>
<div v-if="showLockPasword" class="dialog-lock-password">
  <div class="dialog-main lock-password">
    <div class="dialog-title">
      <div class="name">{{ dialogType == 'new'  ? '下发新密码' : '修改密码' }}</div>
      <div class="close" @click.stop="close" />
    </div>
    <div class="dialog-content">
      <div class="form">
        <div class="item-form">
          <div class="label">被授权人姓名</div>
          <input v-model="userNmae" type="text" placeholder="" />
        </div>
        <div class="item-form">
          <div class="label">被授权人手机号</div>
          <input v-model="userPhone" type="text" placeholder="" />
        </div>
        <div class="item-form">
          <div class="label">密码类型</div>
          <el-select v-model="pwdType" placeholder="" popper-class="pwdType">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="item-form">
          <div class="label">密码</div>
          <input v-model="password" type="text" placeholder="输入 4~16 位数字密码" />
        </div>
        <div class="item-form">
          <div class="label">密码有效期</div>
          <el-date-picker
            popper-class="pwdType"
            v-model="times"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="item-form">
          <div class="label">短信内容</div>
          <textarea rows="3"  v-model="msg" type="text" placeholder="【千丁】欢迎入住，您此次的密码为******，使用有效期为******，请妥善保管，感谢您使用千丁智能门锁！" />
        </div>
        <div class="item-form">
          <div class="label">备注</div>
          <input v-model="remark" type="text" placeholder="选填" />
        </div>
        <div class="footer">
          <button class="cancel" @click.stop="close">取消</button>
          <button class="confirm" @click.stop="submit">修改</button>
        </div>
      </div>
    </div>
  </div>
</div>

</template>
<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      options: [{
        value: '1',
        label: '离线密码'
        }, {
          value: '2',
          label: '在线密码'
        }, {
          value: '3',
          label: '房客密码'
        }, {
          value: '4',
          label: '一次性密码'
        }
      ],
      userName: '',
      userPhone: '',
      pwdType:'',
      password: '',
      msg: '',
      times: '',
      remark: '',
    }
  },
  computed: {
    ...mapState(['showLockPasword','dialogType', 'pwdDetail']),
  },
  components: {
  },
  mounted() {
    this.initData()
  },
  methods: {
    ...mapMutations(['toggleLockPasword']),
    initData() {
      this.userName = this.pwdDetail.userName || ''
      this.userPhone = this.pwdDetail.userPhone || ''
      this.pwdType = this.pwdDetail.pwdType || ''
      this.password = this.pwdDetail.password || ''
      this.times = [this.validStartTime || '', this.validEndTime || '']
      this.remark = this.pwdDetail.remark || ''
    },
    close() {
      this.toggleLockPasword({})
    },
    submit() {
      if(this.dialogType == 'new') {
        this.addPwd()
      } else {
        this.modifyPwd()
      }
    },
    addPwd() {
      this.$http({
        method:'post',
        url:'/api/json/gyLockApi/addPassword',
        data:{
          manufacturerId: '',
          userName: this.userName,
          userPhone: this.userPhone,
          password: this.password,
          validStartTime: this.times[0],
          validEndTime: this.times[1],
          msg: '',
          remark: this.remark,
        }
      })
        .then(() => {
          this.close()
          this.$Message.success('操作成功！')
        })
    },
    modifyPwd() {
      this.$http({
        method:'post',
        url:'/api/json/gyLockApi/updatePassword',
        data:{
          manufacturerId: '',
          pwdId: this.pwdDetail.pwdId || '',
          userName: this.userName,
          userPhone: this.userPhone,
          password: this.password,
          validStartTime: this.times[0],
          validEndTime: this.times[1],
          msg: '',
          remark: this.remark,
        }
      })
        .then(() => {
          this.close()
          this.$Message.success('操作成功！')
        })
    }
  },
  watch: {
  }
}
</script>
<style lang="less" scoped>
.dialog-lock-password{
  &::after{
    content: "";
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,16,31,0.6);
  }
  .dialog-main {
    &.lock-password{
      width: 546px;
      height: 648px;
      z-index: 1009;
      .dialog-content{
        .form{
          .item-form{
            display: flex;
            justify-content: center;
            margin-bottom: 32px;
            .label{
              font-size: 14px;
              width:120px;
              padding-right:16px;
              text-align: right;
              color:rgba(255,255,255,0.6);
            }
            input, textarea{
              flex: 1;
              padding-left: 8px;
              font-size:14px;
              border:none;
              outline: none;
              height:32px;
              background:rgba(255,255,255,0.04);
              border-radius:2px;
              border:1px solid rgba(255,255,255,0.08);
              color:rgba(255,255,255,0.8);
            }
            textarea{
              height: 80px;
            }
          }

          .footer{
            position: relative;
            height: 55px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            font-size: 14px;
            .cancel{
              outline:none;
              width: 64px;
              height: 32px;
              border-radius:2px;
              border:1px solid rgba(255,255,255,0.4);
              color:rgba(255,255,255,0.8);
              background: transparent;
              margin-right: 16px;
              &.footer{
                width: 64px;
              }
            }
            .confirm{
              outline:none;
              border: none;
              width: 64px;
              height: 32px;

              background:rgba(0,183,255,1);
              border-radius:2px;
              color: #fff;
            }
          }
        }
      }
    }
  }
}

</style>
