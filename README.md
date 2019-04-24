# vue-mobile-demo

绑定了微信公众号的答题网站，主要功能：1、取到wx公众号的appId和appSecret，配置回调地址，前端重定向到微信授权地址，截取到授权成功回调地址中的code，把code传给后台。后台拿code去取access_token和openId，后续有需要的用户信息可拿前面信息从wx资源服务器上获取;2、前端控制页面跳转，在vue-router的beforeEach前置守卫中统一处理，业务逻辑包括 未授权时，重定向到微信授权地址（注意重定向也会重新走进beforeEach ）， 如果当前地址中包含 code，表明是授权成功回调地址。取出code,传给后台，得到后台返回的openId, 将openId存起来，以便后面判断用户是否授权。 已授权时，根据业务逻辑判断页面跳转。  重点，踩过坑的，业务逻辑复杂的时候，next() 前最好加return ，不然会接着执行后面的代码 ； 3.页面挺简单，就不详述了~~~

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# 运用的样式组件库
## mint-ui 


## Take some notes
### 微信中内置的网页浏览器，会遇到较多的兼容性问题，需要多测试查看。 比如有些手机不支持9位数格式的颜色（带透明度。 vedio的autoplay兼容性很差，在微信内置浏览器中基本没用，还需要针对不同手机做兼容。


