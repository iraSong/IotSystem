<template>
<div v-if="showLockPasword" class="dialog-lock-password">
  <div class="dialog-main lock-password">
    <div class="dialog-title">
      <div class="name">{{ dialogType == 'new'  ? '新增开放日' : '编辑开放日' }}</div>
      <div class="close" @click.stop="close" />
    </div>
    <div class="dialog-content">
      <div class="form">
        <div class="item-form">
          <div class="label">被授权人姓名</div>
          <input 
            v-model="userName" 
            class="pw-form-r"
            name="userName"
            @input="handleValidate('userName')"
            placeholder="请输入姓名，不超过20字"
            maxlength="20"
            :readonly="dialogType != 'new'"
            :error="errors.userName"
          />
        </div>
        <div class="item-form">
          <div class="label">被授权人手机号</div>
          <input v-model="userPhone" 
            class="pw-form-r"
            name="userPhone"
            @input="handleValidate('userPhone')"
            maxlength="11"
            :readonly="dialogType != 'new'"
            placeholder="请输入11位有效手机号"
            :error="errors.userPhone"/>
        </div>
        <div class="item-form">
          <div class="label">密码类型</div>
          <el-select v-model="pwdType" :disabled="dialogType != 'new'" placeholder="" popper-class="pwdType">
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
          <input
            v-if="pwdType !== 'offlinePwd' && pwdType !== 'timesPwd'"
            v-model="password" 
            class="pw-form-r"
            placeholder="请输入 4~16 位数字密码"
            name="password"
            @input="handleValidate('password')"
            maxlength="16"
            :error="errors.password"
          />
          <input
            v-else
            class="pw-form-r"
            placeholder="系统随机生成"
            name="password"
            maxlength="16"
            readonly
          />
        </div>
        <div class="item-form">
          <div class="label">密码有效期</div>
          <el-date-picker
            class="pw-form-r"
            @change="handleValidate('times')"
            :error="errors.times"
            popper-class="pwdType"
            v-model="times"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy.MM.dd HH:mm"
            value-format="timestamp"
            >
          </el-date-picker>
        </div>
        <div class="item-form">
          <div class="label">短信内容</div>
          <textarea class="pw-form-r" rows="3"  v-model="msg" type="text" readonly placeholder="" />
        </div>
        <div class="item-form">
          <div class="label">备注</div>
          <input v-model="remark" class="pw-form-r" type="text" placeholder="选填，不超过 30 字" />
        </div>
        <div class="footer">
          <button class="cancel" @click.stop="close">取消</button>
          <button class="confirm" @click.stop="submit">{{ dialogType == 'new'  ? '下发' : '修改' }}</button>
        </div>
      </div>
    </div>
  </div>
</div>

</template>
<script>
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      dialogType: 'new',  // new  modify

      configInfo: {}
    }
  },
  computed: {
  },
  components: {
  },
  methods: {
    ...mapMutations(['toggleLockPasword']),
    initData() {
      this.userName = this.pwdDetail.userName || ''
      this.userPhone = this.pwdDetail.userPhone || ''
      this.pwdType = this.pwdDetail.pwdType || 'timesPwd'
      this.password = this.pwdDetail.password || ''
      this.times = [this.pwdDetail.validStartTime || '', this.pwdDetail.validEndTime || '']
      this.remark = this.pwdDetail.remark || ''
      this.getSMSText()
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
      let params = this.getParams()
      if(params) {
        this.$http({
          method:'post',
          url:'/api/json/gyLockApi/addPassword',
          data: params
        })
          .then(() => {
            this.close()
            this.$Message.success('操作成功！')
          })
      }
    },
    modifyPwd() {
      this.$http({
        method:'post',
        url:'/api/json/gyLockApi/updatePassword',
        data:{
          manufacturerId: this.lockDeviceInfo.manufacturerId,
          pwdId: this.pwdDetail.pwdId || '',
          userName: this.userName,
          userPhone: this.userPhone,
          password: this.password,
          validStartTime: this.times[0],
          validEndTime: this.times[1],
          remark: this.remark,
        }
      })
        .then((res) => {
          this.close()
          if (res.data && res.data.result === "1001") {
            this.$Message.success('操作成功！')
          } else {
            this.$Message.error(res.msg || '操作失败')
          }
        })
    },

    getSMSText() {
      let { lockDeviceInfo } = this
      this.$http({
        method:'post',
        url:'/api/json/gyLockApi/getSMSText',
        data:{
          manufacturerId: lockDeviceInfo.manufacturerId,
          lockSn: lockDeviceInfo.deviceSn
        }
      })
       .then((res) =>{
          if (res.data && res.data.result === "1001") {
            this.msg = res.data.content
          } else {
            this.$Message.error(res.msg)
          }
       })
    },
    handleValidate(key) {
      let bool_
      if (key === "userPhone") {
        bool_ =
          Boolean(this[key].length) && /^1[3|4|5|7|8|9|]\d{9}$/.test(this[key])
      } else if (key === "pwd") {
        bool_ = /^\d{4,16}$/.test(this[key])
      } else {
        bool_ = Boolean(this[key] && this[key].length)
      }
      this.$set(this.errors, key, !bool_)
      return this.errors[key]
    },
    getParams() {
        let params = null
        switch (this.pwdType) {
          case "timesPwd": // 一次性密码
            this.handleValidate("userName") ||
              this.handleValidate("userPhone") ||
              (params = {
                userName: this.userName,
                userPhone: this.userPhone
              })
            break
          case "offlinePwd": // 离线密码
            this.handleValidate("userName") ||
              this.handleValidate("userPhone") ||
              this.handleValidate("times") ||
              (params = {
                userName: this.userName,
                userPhone: this.userPhone,
                validStartTime: this.times[0],
                validEndTime: this.times[1]
              })
            break
          default: // 自定义密码
            this.handleValidate("userName") ||
              this.handleValidate("userPhone") ||
              this.handleValidate("times") ||
              this.handleValidate("password") ||
              (params = {
                userName: this.userName,
                userPhone: this.userPhone,
                validStartTime: this.times[0],
                validEndTime: this.times[1],
                password: this.password,
              })
            break
        }
        if(params) {
          params.manufacturerId = this.lockDeviceInfo.manufacturerId,
          params.lockSn = this.lockDeviceInfo.deviceSn
          params.pwdType = this.pwdType
          params.remark = this.remark
        }
        return params
    },
  },
  watch: {
    showLockPasword(val) {
      if(val) {
        this.initData()
      }
    }
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
        height: auto;
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
              color:rgba(255,255,255,0.2);
              border-radius:2px;
              border:1px solid rgba(255,255,255,0.08);
            }

            .pw-form-r {
              &[readonly] {
                background:rgba(255,255,255,0.12);
              }
              &[error] {
                border-color: #FF4646;
              }
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
