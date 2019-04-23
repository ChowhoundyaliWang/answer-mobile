<template>
  <div class="tip-container">
    <h3>{{ msg }}</h3>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: '请您先关注公众号再进行答题！'
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

