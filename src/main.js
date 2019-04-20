// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// 这里可以省略 node_modules 这一层目录
import 'mint-ui/lib/style.css'
import router from './router'
import './style/common.css'
import store from './store'
// 引入 axios
import axios from 'axios'
Vue.prototype.$axios = axios

import jsonp from 'jsonp'
Vue.prototype.$jsonp = jsonp

Vue.config.productionTip = false

// 按需引入mint-ui部分组件（推荐使用方式）；使用 Vue.component 注册
import { Field, Button, Checklist } from 'mint-ui'
Vue.component(Field.name, Field)
Vue.component(Button.name, Button)
Vue.component(Checklist.name, Checklist)
import { Toast } from "mint-ui"

//全局前置守卫
router.beforeEach((to, from, next) => {
  const openId = sessionStorage.getItem('openId')
  if (openId) {
    // 正常的路由切换
    let subscribe = sessionStorage.getItem("subscribe");
    let userInfoMobile = JSON.parse(sessionStorage.getItem('userInfo')).mobile
    if(userInfoMobile){
      next()
    }else{
      checkUserInfo(openId, subscribe, next) 
    }  
  } else {
    const curUrl = window.location.href
    // 判断是否微信授权，如果未授权则跳转到授权页面；如果已授权，进入 to 中的目标 路由对象
    if (curUrl.indexOf('code') > 1) {
      const newCode = getCode(curUrl) + ''
      let params = {
        "head": {
          "transcode": "get_wx_user_info",
          "traceid": "123456",
          "channel": "IOS",
          "devid": "866980023217058",
          "context": new Date()
        },
        "body": {
          "code": newCode,
        }
      };
      axios.post('/get_wx_user_info', params).then((res) => {
        const data = res.data;
        if (data.head.errcode == '0000') {
          const openId = data.body.openId
          const subscribe = data.body.subscribe
          sessionStorage.setItem('openId', openId)
          sessionStorage.setItem('subscribe', subscribe)
          checkUserInfo(openId, subscribe, next)
        }
      })
      function getCode(url) {
        if (url.indexOf('?') > -1) {
          return url.substr(url.indexOf('?') + 1).split('&')[0].split('=')[1]
        }
      }
      next()
    } else {
      // 获取微信授权码
      const appid = 'wx3012db1455bf0c20'
      const redirect_uri = encodeURIComponent('http://tuanwei.daoziwo.wang/index.html')
      let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + redirect_uri + '&response_type=code' + '&scope=snsapi_userinfo' + '&state=STATE' + '#wechat_redirect';
      window.location.href = url;   // 页面刷新会走导航守卫
      // 如果用户同意授权，将会跳转至 redirect_uri/?code=CODE&state=STATE
    }
  }

  function checkUserInfo(openId, subscribe, next){
    if (subscribe == 1) {
      let params = {
        head: {
          transcode: "check_wx_user_info",
          traceid: "123456",
          channel: "IOS",
          devid: "866980023217058",
          context: new Date()
        },
        body: {
          openId: openId
        }
      };
      axios.post("/check_wx_user_info", params).then(res => {
        const data = res.data;
        if (data.head.errcode === "0000") {
          sessionStorage.setItem("userInfo", JSON.stringify(data.body));
          switch (data.body.status) {
            case "0":
              next('/home')
              break;
            case "1":
              next('/item')
              break;
            case "2":
              next('/score')
              break;
          }
        } else {
          next()  // 数据库错误
        }
      });
    } else {
      next('/tip')
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

