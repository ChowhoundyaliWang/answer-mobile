<template>
  <div class="item-container">
    <div class="img-div">
      <img src="../assets/font02.png" alt="error" class="font-img">
    </div>
    <div class="item-content">
      <div v-show='itemList.length > 1'>
        <p>{{ itemIndex + 1 + '、' + item.question }}</p>
        <ul>
          <!-- 看到以下这段代码别笑，后台先把接口定好了TT -->
          <li @click="handleChoose('A')">
            <span :class="[ 'option-style', this.answer == 'A' ? 'active-style':'']">
              <span>A</span>
            </span>
            <span class="option-detail">{{ item.A }}</span>
          </li>
          <li @click="handleChoose('B')">
            <span :class="[ 'option-style', this.answer == 'B' ? 'active-style':'']">
              <span>B</span>
            </span>
            <span>{{ item.B }}</span>
          </li>
          <li @click="handleChoose('C')">
            <span :class="[ 'option-style', this.answer == 'C' ? 'active-style':'']">
              <span>C</span>
            </span>
            <span>{{ item.C }}</span>
          </li>
          <li @click="handleChoose('D')">
            <span :class="[ 'option-style', this.answer == 'D' ? 'active-style':'']">
              <span>D</span>
            </span>
            <span>{{ item.D }}</span>
          </li>
        </ul>
        <mt-button @click="nextItem(item.questionId)" v-if="itemIndex < itemList.length - 1">下一题</mt-button>
        <mt-button type="default" @click="submitAnswer(item.questionId)" v-else>提交答案</mt-button>
      </div>
    </div>
    <div class='footer'>
      <p class='p1'>共青团仁怀市委</p>
      <p class='p2'>仁怀搏悦健身俱乐部</p>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  name: "Item",
  data() {
    return {
      parm: [], // 答案数组
      userId: "",
      traceId: "",
      itemList: [],
      item: {},
      itemIndex: 0,
      answer: "",
      clicked: false,
      instance: '',
      timeoutTimer: ''
    };
  },
  created(){
    this.handleTimeout()
  },
  mounted() {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    let loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
    this.userId = (userInfo && userInfo.userId) || (loginInfo && loginInfo.userId);
    let params = {
      head: {
        transcode: "get_question",
        traceid: "123456",
        channel: "IOS",
        devid: "866980023217058",
        context: new Date()
      },
      body: {
        userId: this.userId
      }
    };
    this.$axios.post("/get_question", params).then(res => {
      const data = res.data;
      // 获取答题列表
      if (data.head.errcode == "E8100001") {
        Toast({
          message: "抱歉，您的答题次数过多噢~",
          duration: -1
        });
      } else {
        this.traceId = data.body.traceId;
        this.itemList = data.body.data;
        this.item = this.itemList[this.itemIndex];
      }
    });
  },
  methods: {
    handleTimeout(){
      setTimeout( () => {
         this.timeoutTimer = Toast('答题时限为20分钟，您已超时，正在提交答案！')
         this.toScore()
      }, 1000*60*20)
    },
    handleChoose(answer) {
      // 选择答案
      this.answer = answer;
    },
    nextItem(questionId) {
      if(this.timeoutTimer) return;
      if (!this.answer) {
        Toast("您还没有选择答案噢！");
        return;
      }
      this.parm.push({ questionId: questionId, answer: this.answer });
      // 下一题
      this.itemIndex += 1;
      this.answer = "";
      this.item = this.itemList[this.itemIndex];
    },
    submitAnswer(questionId) {
      if(this.clicked || this.timeoutTimer ) return;
      this.clicked = true
      if (!this.answer) {
        Toast("您还没有选择答案噢！");
        return;
      }
      this.parm.push({ questionId: questionId, answer: this.answer });
      this.instance = Toast('答案正在提交中,请稍后~')
      this.toScore()
    },
    toScore(){
      // 提交答案
      let params = {
        head: {
          transcode: "check_question",
          traceid: "123456",
          channel: "IOS",
          devid: "866980023217058",
          context: new Date()
        },
        body: {
          userId: this.userId,
          traceId: this.traceId,
          parm: this.parm
        }
      };
      this.$axios.post("/check_question", params).then(res => {
        const data = res.data;
        sessionStorage.setItem("scoreInfo", JSON.stringify(data.body));
        if (data.head.errcode === "0000") {
          if(this.instance){
            this.instance.close()
          }
          if(this.timeoutTimer){
             this.timeoutTimer.close()
          }  
          this.$router.push("score");
        } else {
          Toast("系统错误，请稍后重试~");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.item-container {
  .img-div {
    text-align: center;
    .font-img {
      width: 220px;
    }
    margin-bottom: 1vh
  }
  .item-content {
    margin: 0 8% 2vh 8%;
    width: 76%;
    height: 60vh;
    overflow-y: auto;
    background-color: #ffffff;
    box-shadow: 0px 0px 4px 4px #ded5d5;
    border-radius: 2%;
    color: #333333;
    padding: 4vh 4%;
    font-size: 13px;
    ul {
      margin: 2vh 0;
      li {
        margin: 1vh 0 1vh 0;
      }
    }
    .option-style {
      display: inline-block;
      width: 24px;
      height: 24px;
      border: 1px solid #806766;
      border-radius: 50%;
      text-align: center;
      margin-right: 10px;
      line-height: 22px;
      &.active-style {
        background-color: #b52021;
        color: #ffffff;
        border-color: #b52021;
      }
    }
    .mint-button--default {
      color: #ffffff;
      background-color: #b52021;
      display: block;
      margin: 0 auto;
      margin-top: 3vh;
    }
  }
  .video-container {
    width:70%;
    margin: 0 auto;
    margin-top: 3vh;
  }
  .footer{
    width: 84%;
    margin: auto;
    height: 20px;
    color: #460d76;
    position: relative;
    font-size: 12px;
    .p1{
      position: absolute;
      left: 10%;
      top: 0;
    }
    .p2{
      position: absolute;
      right: 10%;
      top: 0;
    }
  }
}
</style>

