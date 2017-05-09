<template>
    <div id="uploadimg">
      <div class="uploadbutton">
        <button type="button" class="am-btn am-btn-primary" id="chooseImg">选择照片</button>
      </div>
      <p>你选择的图片如下:</p>
      <div class="imgpreview">
        <img width="150px" height="200px" id="img">
      </div>
    </div>
</template>
<style lang="scss">
    body{
        background-color: white;
    }
    #uploadimg {
      /* 上传照片的按钮 */
      .uploadbutton {
        margin: 30px 0;
      }
      /* 预览框 */
      .imgpreview {
        margin: auto;
        padding: auto;
        width: 300px;
        height: 400px;
      }
    }
</style>
<script>
    var wx = require('weixin-js-sdk')
    export default{
      props: [],
      data () {
        return {
          temp: '',
          imgsrc: ''
        }
      },
      computed: {
        resbody: function () {
          return this.$root.wxsignature
        }
      },
      mounted: function () {
        this.$nextTick(function () {
          let that = this
          wx.config({
            debug: false,
            appId: that.resbody.appId,          // 必填，公众号的唯一标识
            timestamp: that.resbody.timestamp,      // 必填，生成签名的时间戳
            nonceStr: that.resbody.nonceStr,      // 必填，生成签名的随机串
            signature: that.resbody.signature,      // 必填，签名，见附录1
            jsApiList: that.resbody.jsApiList       // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          })
          wx.ready(function () {
            $('#chooseImg').on('click', function () {
              wx.chooseImage({
                count: 1,  // 默认9
                sizeType: ['original', 'compressed'],  // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'],  // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                  $('#img').attr('src', res.localIds)
                  that.imgsrc = res.localIds
                }
              })
            })
          })
        })
      },
      methods: {
        setDefaultImgSrc (src) {
          $('#img').attr('src', src)
          this.imgsrc = src
        }
      }
    }
</script>
