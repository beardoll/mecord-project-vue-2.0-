<template>
    <div id="gate">
      <div id="tipsword">
        <i class="am-icon-spinner am-icon-md am-icon-spin"></i>
        <p style="font-size:16px">页面加载中</p>
      </div>
    </div>
</template>
<style>
    #gate{
        background-color: white;
        background-repeat: no-repeat;
        background-size: 100%;
    }
    #tipsword{
      width: 70%;
      text-align: center;
      margin: auto;
      margin-top: 200px;
    }
</style>
<script>
/*  var qs = require('querystring') */
  export default {
/*    created: function () {
      let params = qs.parse(window.location.href.split('?')[1])
      if (params.code) {
        this.$http.get('https://api.mecord.cn/api/MecordUsers/wxLogin?code=' + params.code)
          .then((response) => {
            console.log('登录成功！')
            var wxurl = window.location.href.split('#')[0]
            wxurl = encodeURIComponent(wxurl)
            this.$root.login(wxurl, response.body.data)
          }, (response) => {
            console.log('bad!')
          })
      }
    } */
    mounted: function () {
      this.$nextTick(function () {
        console.log('begin login!')
        var wxurl = window.location.href.split('#')[0]
        wxurl = encodeURIComponent(wxurl)
        this.$root.login(wxurl, 'FMc6E3GSniUrT49vt7OJ1pKWJfRRaP3NWFpCwJttKg4Bod1nVkrIITORG0JIPRiD')
      })
    }
  }
</script>
