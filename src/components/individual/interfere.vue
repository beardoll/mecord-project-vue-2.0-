<template>
  <div id="userinfo">
    <div class="am-u-sm-3" style="text-align:left;margin:0;padding:0">
      <img :src="imgsrc" style="height:80px;width:80px;margin-top:auto;margin-bottom:auto;margin-left:0;padding: 5px">
    </div>
    <div class="am-u-sm-6 am-u-end" style="margin:0;padding-top:10px;text-align:left">
      <div style="text-align:left;margin:auto;padding:auto">
        <p style="margin:0;padding:0">姓名：{{user}}</p>
        <p style="margin-top:8px;padding:0">积分：{{score}}<img src="../../assets/score.png" style="width: 20px; height: 20px; margin-left: 5px"></p>
      </div>
    </div>
    <div class="useroperation">
      <table class="am-table useroperationlist" style="margin:0">
        <tbody>
        <tr>
          <td @click.stop="goSelfMaterial()">&nbsp;&nbsp;&nbsp;&nbsp;个人资料</td>
        </tr>
<!--        <tr>
          <td @click.stop="upLoadImg()">&nbsp;&nbsp;&nbsp;&nbsp;上传舌苔照片</td>
        </tr>
        <tr>
          <td style="text-align:left">&nbsp;&nbsp;&nbsp;&nbsp;账户绑定</td>
        </tr>
        <tr>
          <td style="text-align:left">&nbsp;&nbsp;&nbsp;&nbsp;隐私设置</td>
        </tr>
        <tr>
          <td style="text-align:left">&nbsp;&nbsp;&nbsp;&nbsp;消息推送</td>
        </tr>
        <tr>
          <td style="text-align:left">&nbsp;&nbsp;&nbsp;&nbsp;检查更新</td>
        </tr>
        <tr>
          <td style="text-align:left">&nbsp;&nbsp;&nbsp;&nbsp;关于</td>
        </tr>-->
        </tbody>
      </table>
      <hr data-am-widget="divider" style="margin:0" class="am-divider am-divider-default" />
    </div>
  </div>
</template>
<style lang="scss">
    body{
        background-color: white;
    }
    #userinfo{
      /*   操作选择(e.g 账户绑定等，外div) */
      .useroperation{
        margin: 0;
        .useroperationlist{
          tbody tr td{ /*   具体操作选择    */
            cursor: pointer;
            text-align:left;
          }
          tbody tr td:hover{ /*   具体操作选择,鼠标经过的时候单元格变色    */
            background-color: darkgrey;
          }
        }
      }
    }
</style>
<script>
    export default{
      data () {
        return {
        }
      },
      computed: {
        user: function () {
          return this.$root.userData.nickname
        },
        role: function () {
          var temp = this.$root.userData.role
          if (temp === 'patient') {
            return '病人'
          } else {
            return '医生'
          }
        },
        imgsrc: function () {   // 头像的url地址
          return this.$root.userData.avatar
        },
        score: function () {    // 用户节分
          return this.$root.userData.score
        }
      },
      methods: {
        goSelfMaterial () {
          this.$router.push('/selfmaterial')
        }
      }
    }
</script>
