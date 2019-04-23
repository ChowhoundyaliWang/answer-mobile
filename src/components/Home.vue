<template>
  <div class="home-container">
    <div class="img-div">
      <img src="../assets/font01.png" alt="error" class="font-img">
    </div>

    <div class="log-container">
      <mt-field label="姓名" placeholder v-model="name"></mt-field>
      <mt-field
        label="手机号"
        placeholder
        type="tel"
        v-model="mobile"
        @change=" captchaStr = ''; captcha = ''"
      ></mt-field>
      <mt-field label="验证码" v-model="captcha">
        <button class="captcha-btn" @click="getCaptcha">点击获取</button>
      </mt-field>
      <button class="submit-btn" @click="submitUser">开&nbsp;&nbsp;始&nbsp;&nbsp;答&nbsp;&nbsp;题</button>
    </div>
    <p>主办单位：共青团仁怀市委</p>
    <p>协办单位：仁怀市搏悦健身俱乐部</p> 
    <p>活动时间：4月23日-4月25日</p> 
    
  </div>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      openId: "", // 用户的微信id
      name: "",
      mobile: "",
      captcha: "",
      captchaStr: "" // 前端随机生成的二维码
    };
  },
  methods: {
    getCaptcha() {
      if (this.captchaStr) {
        Toast("请勿重复操作验证码！");
        return;
      }
      let mobile = this.mobile;
      let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!phoneReg.test(mobile)) {
        Toast("请输入正确的手机号！");
        return;
      }
      // 随机生成四位数字验证码
      for (let i = 0; i < 4; i++) {
        this.captchaStr += parseInt(Math.random() * 10);
      }
      let params = {
        head: {
          transcode: "check_code",
          traceid: "123456",
          channel: "IOS",
          devid: "866980023217058",
          context: new Date()
        },
        body: {
          mobile: mobile,
          code: this.captchaStr
        }
      };
      this.$axios.post("/check_code", params).then(res => {});
    },
    submitUser() {
      if (this.name === "") {
        Toast("请先填写姓名再提交~");
        return;
      }
      let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!phoneReg.test(this.mobile)) {
        Toast("请输入正确的手机号！");
        return;
      }
      if (this.captcha != this.captchaStr) {
        Toast("验证码不正确！");
        return;
      }

      this.openId = sessionStorage.getItem("openId");
      let params = {
        head: {
          transcode: "get_user_status",
          traceid: "123456",
          channel: "IOS",
          devid: "866980023217058",
          context: new Date()
        },
        body: {
          mobile: this.mobile,
          openId: this.openId,
          name: this.name
        }
      };
      this.$axios.post("/get_user_status", params).then(res => {
        const data = res.data;
        // 保存用户信息
        sessionStorage.setItem("loginInfo", JSON.stringify(data.body));
        if (data.head.errcode == "E8100002") {
          Toast("微信号和手机号都只能使用一次，请勿重复使用！");
        } else {
          this.$router.push("item");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.home-container {
  padding: 3vh 0 0 0;
  color: #460d76;
  .img-div {
    text-align: center;
    .font-img {
      width: 240px;
    }
    margin-bottom: 6vh;
  }
  .mint-cell {
    background-color: transparent;
    input {
      background-color: transparent;
    }
  }

  .log-container {
    font-weight: 700;
    padding: 2vh 15% 10vh 15%;
    button {
      background-color: transparent;
      border: none;
      color: #ffffff;
      padding: 0;
      &.submit-btn {
        margin-top: 6vh;
        width: 100%;
        height: 40px;
        background-color: #a867e0 ;
        border-radius: 16px;
        line-height: 40px;
        font-size: 20px;
        background: radial-gradient(#9551cd,#a867e0,#b675ec, #d2a4fa, ragb(255,255,255,0.1));
      }
      &.captcha-btn {
        width: 76px;
        height: 30px;
        background-color: #a867e0;
        line-height: 30px;
        border-radius: 10px;
      }
      outline: none;
    }
    .mint-button--default.is-plain {
      border-color: #333;
      color: #333;
      border-radius: 0;
    }
  }
  p {
    width: 188px;
    text-align: left;
    font-size: 12px;
    line-height: 24px;
    margin-left: calc(50% - 94px);
    color: #460d76;
  }
}
</style>

