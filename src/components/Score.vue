<template>
  <div class="score-container">
    <div class="score-content">
      <h3>恭喜你！完成了所有题目！</h3>
      <h3>
        您的得分是：
        <span>{{ score }}</span> 分
      </h3>
      <h3>
        共耗时：
        <span>{{ time }}</span>
      </h3>
      <div class="list-container">
        <div class="list-up">
          <h4>前51名排行榜</h4>
          <table>
            <thead>
              <tr>
                <th>排名</th>
                <th>分数</th>
                <th>耗时</th>
                <th>综合得分</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,ind) in scoreList" :key="item.userId">
                <td>&nbsp;&nbsp;{{ ind+1 }}</td>
                <td>{{ item.score }}</td>
                <td>{{ getTime(item.time) }}</td>
                <td>{{ item.trueScore }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="list-down">
          <p>如果您对活动有任何建议，<br>
            欢迎联系我们：0851-22235959</p>
        </div>
      </div>
      <div class="footer">
        <p class="p1">共青团仁怀市委</p>
        <p class="p2">仁怀搏悦健身俱乐部</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  name: "Score",
  data() {
    return {
      score: "",
      time: "",
      scoreList: []
    };
  },
  created() {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    const scoreInfo = JSON.parse(sessionStorage.getItem("scoreInfo"));
    this.score = (userInfo && userInfo.score) || scoreInfo.score;
    this.time = this.getTime(
      (userInfo && userInfo.time) || (scoreInfo && scoreInfo.time)
    );
    const params = {
      head: {
        transcode: "answer_ranking_list",
        traceid: "123456",
        channel: "IOS",
        devid: "866980023217058",
        context: new Date()
      },
      body: {}
    };
    this.$axios.post("/answer_ranking_list", params).then(res => {
      const data = res.data;
      if (data.head.errcode === "0000") {
        this.scoreList = data.body.data;
      } else {
        Toast("系统错误，请稍后重试~");
      }
    });
  },
  methods: {
    getTime(total) {
      // 计算答题时间
      let time = parseFloat(total) / 1000;
      if (null != time && "" != time) {
        if (time > 60 && time < 60 * 60) {
          time =
            "00:" +
            parseInt(time / 60.0) +
            ":" +
            parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60);
        } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
          time =
            parseInt(time / 3600.0) +
            ":" +
            parseInt(
              (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
            ) +
            ":" +
            parseInt(
              (parseFloat(
                (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
              ) -
                parseInt(
                  (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
                )) *
                60
            );
        } else {
          time = "00:00:" + parseInt(time);
        }
      }
      return time;
    }
  }
};
</script>

<style lang="scss" scoped>
.score-container {
  padding: 2vh 6% 0 6%;
  .score-content {
    width: 100%;
    h3 {
      text-align: center;
      margin: 2vh 0;
      color: #460d76;
      font-weight: 550;
      font-size: 16px;
      span {
        display: inline-block;
        padding: 1vh 4%;
        border: 1px solid #fff;
        box-shadow: 1px 1px 2px 2px #ded5d5;
      }
    }
    .list-container {
      width: 100%;
      height: 60vh;
      background-color: #ffffff;
      box-shadow: 0px 0px 4px 4px #ded5d5;
      padding: 2vh 0 3vh 0;
      color: #ae0002;
      margin-bottom: 2vh;
      .list-up {
        height: 56vh;
        overflow-y: auto;
        h4 {
          text-align: center;
          margin-bottom: 2vh;
        }
        table {
          width: 100%;
          text-align: center;
          font-size: 13px;
        }
      }
      .list-down{
        text-align: center;
        font-size: 11px;
      }
    }
    .footer {
      width: 100%;
      margin: auto;
      height: 20px;
      color: #ae0002;
      position: relative;
      font-size: 12px;
      .p1 {
        position: absolute;
        left: 10%;
        top: 0;
      }
      .p2 {
        position: absolute;
        right: 10%;
        top: 0;
      }
    }
  }
}
</style>

