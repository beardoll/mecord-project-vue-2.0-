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
      // 这里使用授权码登陆模式，为实际使用的模式
      let params = qs.parse(window.location.href.split('?')[1])
      if (params.code) {
        this.$http.get('https://api.mecord.cn/api/MecordUsers/wxLogin?code=' + params.code)
          .then((response) => {
            // 返回userId以及Id
            // wxurl: 注册微信签名时需要用到用户页面的具体url地址
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
      // 这里仅作调试之用，assesstoken直接从Mecord API获得
      this.$nextTick(function () {
        console.log('begin login!')
        var wxurl = window.location.href.split('#')[0]
        wxurl = encodeURIComponent(wxurl)
        this.$root.login(wxurl, 'ez5vvico5xy020LMruUEZW7ed2xAW9u7RPap5YFINk3pNFlS6IDFYUf4VFErmjWI')
      })
    }
  }
</script>
