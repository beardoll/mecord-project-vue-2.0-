<template>
  <div id="headtitle">
    {{name}}
  </div>
</template>

<style lang="scss">
  #headtitle{
    background-color: #00d4b4;
    width: 100%;
    height: 40px;
    padding: 5px 0px;
    color: white;
    font-size: 20px;
  }
</style>

<script>
  export default{
    props: ['name'],
    data () {
      return {

      }
    }
  }
</script>
