<template>
  <div class="home-container">
    <h3>团市委青年大学习——</h3>
    <h4>寻找仁怀“锦鲤”</h4>
    <div class="log-container">
      <mt-field label="姓名" placeholder v-model="name"></mt-field>
      <mt-field label="手机号" placeholder type="tel" v-model="mobile" @change=' captchaStr = "" '></mt-field>
      <mt-field label="验证码" v-model="captcha">
        <mt-button plain class="captcha-btn" @click="getCaptcha">点击获取</mt-button>
      </mt-field>
      <mt-button plain class="submit-btn" @click='submitUser'>开始答题</mt-button>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      openId: '', // 用户的微信id
      name: "",
      mobile: "",
      captcha: "",
      captchaStr: ''  // 前端随机生成的二维码
    };
  },
  methods: {
    getCaptcha() {
      if(this.captchaStr){
        Toast('请勿重复操作验证码！')
        return
      }
      let mobile = this.mobile;
      let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!phoneReg.test(mobile)) {
        Toast('请输入正确的手机号！')
        return
      }
      // 随机生成四位数字验证码
      for (let i = 0; i < 4; i++) {
        this.captchaStr += parseInt(Math.random() * 10);
      }
      this.$axios.get("https://39.105.14.188/api/sms/send/message?phone=" + mobile + "&message=【青年大学习——寻找仁怀“锦鲤”】验证码——" + this.captchaStr).then(res => {});
      // this.$jsonp("https://39.105.14.188/api/sms/send/message?phone=" + mobile + "&message=【青年大学习——寻找仁怀“锦鲤”】验证码——" + this.captchaStr, null, () =>{})
    },
    submitUser(){
      if( this.name === ''){
        Toast('请先填写姓名再提交~')
        return
      }
      let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!phoneReg.test( this.mobile)) {
        Toast('请输入正确的手机号！')
        return
      }
      if(this.captcha != this.captchaStr){
        Toast('验证码不正确！')
        return
      }
      
      this.openId = sessionStorage.getItem("openId");
      let params = {
        "head": {
          "transcode": "get_user_status",
          "traceid": "123456",
          "channel": "IOS",
          "devid": "866980023217058",
          "context": new Date()
        },
        "body": {
          "mobile": this.mobile,
          "openId": this.openId,
          "name": this.name
        }
      }
      this.$axios.post('/get_user_status', params).then((res) => {
        const data = res.data;
        // 保存用户信息
        sessionStorage.setItem('loginInfo', JSON.stringify(data.body))
        if(data.head.errcode == 'E8100002'){
          Toast('该手机号已经被使用！')
        }else{
          this.$router.push("item");
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.home-container {
  padding: 15vh 0 0 0;
  color: #ffffff;
  h3,
  h4 {
    text-align: center;
  }
  h3 {
    font-weight: 600;
    margin-bottom: 3vh;
  }
  h4 {
    margin-bottom: 6vh;
  }
  .mint-cell {
    background-color: transparent;
    input {
      background-color: transparent;
    }
  }

  .log-container {
    padding: 2vh 15% 0 15%;
    .submit-btn {
      margin-top: 6vh;
      width: 100%;
    }
    .mint-button--default.is-plain {
      border-color: #fff;
      color: #ffffff;
      border-radius: 0;
    }
    .captcha-btn {
      font-size: 13px;
      height: 28px;
      line-height: 28px;
      margin-left: 10px;
    }
  }
}
</style>

