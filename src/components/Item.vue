<template>
  <div class="item-container">
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
      <div class="video-container">
        <video
          src="http://tuanwei.daoziwo.wang/shiping.mp4"
          autoplay
          height="100%"
          width="100%"
          loop
        ></video>
      </div>
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
      clicked: false
    };
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
    handleChoose(answer) {
      // 选择答案
      this.answer = answer;
    },
    nextItem(questionId) {
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
      if(this.clicked) return;
      this.clicked = true
      if (!this.answer) {
        Toast("您还没有选择答案噢！");
        return;
      }
      this.parm.push({ questionId: questionId, answer: this.answer });
      let instance = Toast('答案正在提交中,请稍后~')
      // 提交答案
      let params = {
        head: {
          transcode: "check_question",
          traceid: "123456",
          channel: "IOS",
          devid: "866980023217058",
          context: "2015/9/14 17:15:06"
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
          instance.close()
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
  padding-top: 10vh;
  .item-content {
    margin: 0 10% 2vh 10%;
    width: 70%;
    height: 72vh;
    overflow-y: auto;
    background-color: #ffffff;
    box-shadow: 0px 0px 4px 4px #c0bcbca6;
    border-radius: 2%;
    color: #333333;
    padding: 4vh 5%;
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
        background-color: #b52021fc;
        color: #ffffff;
        border-color: #b52021fc;
      }
    }
    .mint-button--default {
      color: #ffffff;
      background-color: #b52021fc;
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
}
</style>

