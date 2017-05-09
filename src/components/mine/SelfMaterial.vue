<template>
    <div id="selfmaterial">
      <div class="smbody" style="width:100%;height:90%">
        <div class="tabs-body">
            <form class="am-form am-form-horizontal">
              <legend>个人信息</legend>
              <div class="am-form-group" style="margin-top: 10px">
                <div class="am-u-sm-4" style="text-align:left">
                  <label for="smuser" class="am-form-label">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</label>
                </div>
                <div class="am-u-sm-8" style="padding:0">
                  <input id="smuser" type="text" class="am-form-field" :value = "nickname" name="nickname">
                </div>
              </div>
              <div class="am-form-group">
                <div class="am-u-sm-4" style="text-align:left">
                  <label for="smsex" class="am-form-label">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</label>
                </div>
                <div class="am-u-sm-8" style="padding:0">
                  <select id="smsex" name="sex">
                    <option value="0" :selected="sex === 0">保密</option>
                    <option value="1" :selected="sex === 1">男</option>
                    <option value="2" :selected="sex === 2">女</option>
                  </select>
                </div>
              </div>
              <div class="am-form-group">
                <div class="am-u-sm-4" style="text-align:left">
                  <label for="smbirth" class="am-form-label">出生年月</label>
                </div>
                <div class="am-u-sm-8" style="padding:0">
                    <input id="smbirth" class="am-form-field" name="birthday" type="date" :value="birthday"/>
                </div>
              </div>
<!--              <legend>隐私信息
                <span class="am-icon am-icon-caret-down"style="margin:0;padding:0" @click.stop="expandPrivateInfo()"></span>
              </legend>
              <div style="display:none" id="privateinfo">
                <div class="am-form-group">
                  <div class="am-u-sm-4" style="text-align:left">
                    <label for="smphone" class="am-form-label" >手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机</label>
                  </div>
                  <div class="am-u-sm-8" style="padding:0">
                    <input id="smphone" type="text" class="am-form-field am-u-sm-9" placeholder="1300000000">
                  </div>
                </div>
                <div class="am-form-group">
                  <div class="am-u-sm-4" style="text-align:left">
                    <label for="smmail" class="am-form-label">邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱</label>
                  </div>
                  <div class="am-u-sm-8" style="padding:0">
                    <input id="smmail" type="text" class="am-form-field am-u-sm-9" placeholder="">
                  </div>
                </div>
                <div class="am-form-group">
                  <div class="am-u-sm-4" style="text-align:left">
                    <label for="smaddr" class="am-form-label">家庭住址</label>
                  </div>
                  <div class="am-u-sm-8" style="padding:0">
                    <input id="smaddr" type="text" class="am-form-field am-u-sm-9" placeholder="">
                  </div>
                </div>
                <div class="am-form-group">
                  <div class="am-u-sm-4" style="text-align:left">
                    <label for="smrealname" class="am-form-label">真实姓名</label>
                  </div>
                  <div class="am-u-sm-8" style="padding:0">
                    <input id="smrealname" type="text" class="am-form-field am-u-sm-9" placeholder="">
                  </div>
                </div>
              </div>-->
            </form>
        </div>
      </div>
      <div class="smfoot am-topbar am-topbar-fixed-bottom">
        <div type="button" class="am-btn am-btn-primary" @click.stop="save()">保存</div>
      </div>
    </div>
</template>
<style lang = "scss">
    *{
      margin: 0;
      padding: 0;
    }
    body{
      background-color: white;
    }
    #selfmaterial {
      margin: 10px 0 0 0;
      background-color: white;
      width: 100%;
      height: 100%;
      padding: 0;
      .smbody{
        width: 100%;
        height: 90%;
        overflow: scroll;
        .tabs-body form{
          margin: 0 40px 0 20px;
          legend{
            text-align: left;
            font-size: 28px;
            color: orange;
            margin: 0px;
          }
        }
      }
    }
</style>
<script>
  export default {
    data () {
      return {
        showIndex: 0
      }
    },
    computed: {
      nickname: function () {
        return this.$root.userData.nickname
      },
      sex: function () {
        return this.$root.userData.sex
      },
      birthday: function () {
        var temp = []
        var bir = this.$root.userData.birthday
        if (bir === null) {
          temp = new Date()
        } else {
          temp = new Date(bir)
        }
        var day = temp.getDate()
        var month = temp.getMonth() + 1
        var year = temp.getFullYear()
        if (parseInt(day) < 10) {
          day = '0' + day
        }
        if (parseInt(month) < 10) {
          month = '0' + month
        }
        var returndata = year + '-' + month + '-' + day
        return returndata
        // return '2014-09-01'
      },
      userid: function () {
        return this.$root.accesstoken.userId
      },
      id: function () {
        return this.$root.accesstoken.id
      }
    },
    methods: {
      expandPrivateInfo () {  // 暂时先不展开个人隐私信息
        // $('#privateinfo').toggle()
      },
      save () {  // 保存个人资料
        var formjson = $('form').serializeArray()
        var name, value
        var newinfo = {}
        for (var i = 0; i < formjson.length; i++) {
          name = formjson[i].name
          value = formjson[i].value
          newinfo[name] = value  // newinfo.name = value
        }
        newinfo.id = this.userid
        var updateurl = 'https://api.mecord.cn/api/MecordUsers/' + this.userid + '?access_token=' + this.id
        this.$http.put(updateurl, newinfo).then((response) => {
          window.alert('保存个人资料成功！')
          this.$root.loadClientDate()
        }, (response) => {
          console.log('can not update')
        })
      }
    }
  }
</script>
