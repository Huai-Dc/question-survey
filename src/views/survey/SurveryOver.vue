<template>
  <div class="survey-content">
    <div class="background">
      <img src="../../assets/images/thanks.jpeg"/>
    </div>
    <span>感谢您的耐心回答！</span>
  </div>
</template>

<script>
    export default {
        name: "survery-test"
    }
</script>

<style lang="scss" scoped>
  .survey-content{
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    .background {
      object-fit: cover;
      margin: auto;
      position: absolute;
      z-index: -1;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      visibility: visible;
      width: 100%;
      height: 100%;
      img{
        width: 100%;
        height: 100%;
      }
    }
    span{
      font-size: 24px;
      font-weight: bolder;
      margin-top: 150px;
      display: block;
      text-align: center;
      color: #666666;
    }
  }

</style>
