<template>
  <div class="tip-container">
    <h3>{{ msg }}</h3>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: '系统错误，请您稍后重试~'
    }
  }
};
</script>

<style lang="scss" scoped>
.tip-container {
  padding: 40vh 20%;
  h3{
      text-align: center;
      color: #460d76;
      font-size: 22px;
      letter-spacing: 1.4px;
  }
}
</style>

