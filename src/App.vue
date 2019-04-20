<template>
  <div class="app-container">
    <!-- 中间内容区域 -->
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>


<script>
export default {
  name: "App",
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter {
  // 进入
  opacity: 0;
  transform: translateX(100%);
}
.fade-leave-to {
  // 离开
  opacity: 0;
  transform: translateX(-100%);
  position: absolute; // 重点： 解决组件切换时，上下的问题
}
</style>
