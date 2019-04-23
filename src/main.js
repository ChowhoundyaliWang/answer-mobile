// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// 这里可以省略 node_modules 这一层目录
import 'mint-ui/lib/style.css'
import router from './router'
import './style/common.css'
// 引入 axios
import axios from 'axios'
Vue.prototype.$axios = axios

Vue.config.productionTip = false

// 按需引入mint-ui部分组件（推荐使用方式）；使用 Vue.component 注册
import { Field, Button, Checklist } from 'mint-ui'
Vue.component(Field.name, Field)
Vue.component(Button.name, Button)
Vue.component(Checklist.name, Checklist)

//全局前置守卫
router.beforeEach((to, from, next) => {
  if(to.path == '/tip' || to.path == '/error'){
    return next()
  }
  const openId = sessionStorage.getItem('openId')  // 有openId表示已授权
  if (openId) {
    return checkUserInfo(openId, next)
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
          if(subscribe == 1){
            return checkUserInfo(openId, next)
          }else{
            return next('/tip')
          }
        }else{
          return next('/error')
        }
      })
      function getCode(url) {
        if (url.indexOf('?') > -1) {
          return url.substr(url.indexOf('?') + 1).split('&')[0].split('=')[1]
        }else{
          return ''
        }
      }
    } else {
      // 获取微信授权码
      const appid = 'wx8ff14e05f0a0a57a'
      const redirect_uri = encodeURIComponent('http://tuanwei.daoziwo.wang/index.html')
      let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + redirect_uri + '&response_type=code' + '&scope=snsapi_userinfo' + '&state=STATE' + '#wechat_redirect';
      window.location.href = url;   // 页面刷新会走导航守卫, 如果用户同意授权，将会跳转至 redirect_uri/?code=CODE&state=STATE
    }
  }

  function checkUserInfo(openId, next){
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
        let status = data.body.status;
        if(status == '0' && to.path != '/home'){
          return next('/home')
        }else if(status == '1' && to.path != '/item'){
          return next('/item')
        }else if(status == '2' && to.path!= '/score'){
          return next('/score')
        }else{
          return next()
        }
      }else{
        return next('/error')
      }
    })
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

