<template>
  <div id="outline">
    <div id="content">
      <homepage v-if="index === 0"></homepage>
      <interfere v-if="index === 1"></interfere>
    </div>
    <div class="am-topbar am-topbar-fixed-bottom" id="footer" style="background:snow">
      <div class="am-u-sm-6" @click.stop="changeIcon(0)">
        <img src="../assets/homewhite.png" class="footerimg" v-if="index !== 0">
        <img src="../assets/homeblue.png"  class="footerimg" v-if="index === 0">
        <p style="margin:0;padding:0;color:dodgerblue">主页</p>
      </div>
      <div class="am-u-sm-6" @click.stop="changeIcon(1)">
        <img src="../assets/personwhite.png" class="footerimg" v-if="index !== 1">
        <img src="../assets/personblue.png" class="footerimg" v-if="index === 1">
        <p style="margin:0;padding:0;color:black">我</p>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
    body{
        background-color: white;
    }
    #outline {
      width: 100%;
      height: 100%;
      #content {
        width: 100%;
        height: 90%;
      }
      /* 页脚  */
      #footer {
        width: 100%;
        height: 10%;
        margin: 0;
        padding: 0;
        /* 底部按钮 */
        .footerimg {
          width: 15%;
          height: 60%;
          margin-top: 5%;
        }
      }
    }
</style>
<script>
    import homepage from './homepage/outer'
    import interfere from './individual/interfere'
    export default{
      data () {
        return {
          index: 0
        }
      },
      components: {
        homepage,
        interfere
      },
      methods: {
        changeIcon (tips) {
          var selectedIndex = tips
          this.index = tips
          $('#footer div').each(function (index, element) {
            if (index === selectedIndex) {  // 当前下标指向发生点击事件的图标
              // console.log($(this).attr('id'))
              $(this).children('p').css('color', 'dodgerblue')
            } else {
              // console.log($(this).children('p'))
              $(this).children('p').css('color', 'black')
            }
          })
        }
      }
    }
</script>
