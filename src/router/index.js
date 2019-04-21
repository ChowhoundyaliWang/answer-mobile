import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import home from '../components/Home.vue'
import item from '../components/Item.vue'
import score from '../components/Score.vue'
import tip from '../components/Tip.vue'
import error from '../components/Error.vue'

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    { path: '/home', name: 'home', component: home },
    { path: '/item', name: 'item', component: item },
    { path: '/score', name: 'score', component: score },
    { path: '/tip', name: 'tip', component: tip },
    { path: '/error', name: 'error', component: error }
  ]
})
