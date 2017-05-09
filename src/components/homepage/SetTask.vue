<template>
  <div id="settask">
    <headtitle name="任务设置"></headtitle>
    <div class="remindtime" >
      <div class="remindtimetitle">设置任务提醒时间</div>
      <hr data-am-widget="divider" style="margin:2px 0 8px 0;padding:0;width: 50%" class="am-divider am-divider-default" />
      <div class="tips">(任务当前的提醒时间为：{{currentremindtime}})</div>
      <form id="settime" class="am-form">
        <div class="am-form-group">
          <div>
            <select name="remindtime" id="remindtime">
              <option value="-1">不提醒</option>
              <option value="0">0:00</option>
              <option value="1">1:00</option>
              <option value="2">2:00</option>
              <option value="3">3:00</option>
              <option value="4">4:00</option>
              <option value="5">5:00</option>
              <option value="6">6:00</option>
              <option value="7">7:00</option>
              <option value="8">8:00</option>
              <option value="9">9:00</option>
              <option value="10">10:00</option>
              <option value="11">11:00</option>
              <option value="12">12:00</option>
              <option value="13">13:00</option>
              <option value="14">14:00</option>
              <option value="15">15:00</option>
              <option value="16">16:00</option>
              <option value="17">17:00</option>
              <option value="18">18:00</option>
              <option value="19">19:00</option>
              <option value="20">20:00</option>
              <option value="21">21:00</option>
              <option value="22">22:00</option>
              <option value="23">23:00</option>
            </select>
          </div>
        </div>
      </form>
      <div class="am-topbar am-topbar-fixed-bottom">
        <button type="button" class="pastpagebtn3 am-btn am-btn-lg am-btn-primary am-radius" @click.stop="save()">保存设置</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  #settask{
    .remindtime{
      padding: 10px;
      /* 设置提醒时间的标题 */
      .remindtimetitle{
        font-weight: bold;
        text-align: left;
        color: coral;
        font-size: 20px;
      }
      /* 提示当前的任务提醒时间 */
      .tips{
        color: #0f9ae0;
        font-size: 14px;
        text-align: left;
        padding: 0 0 5px 0;
      }
    }
  }
</style>

<script>
  import headtitle from '../public_component/head'
  export default {
    data () {
      return {
        pastremindtime: ''
      }
    },
    computed: {
      taskid: function () {
        return this.$root.currentread.id
      },
      currentremindtime: function () {
        var temp = this.$root.currentread.remindTime
        this.pastremindtime = temp
        if (temp === -1) {
          return '不提醒'
        } else {
          return temp + ':00'
        }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        $('#remindtime').val(this.pastremindtime)
      })
    },
    components: {
      headtitle
    },
    methods: {
      save () {
        var formjson = $('#settime').serializeArray()
        var remindtime = formjson[0].value
        this.$http.get('https://api.mecord.cn/api/Tasks/adjustRemindTime?taskId=' + this.taskid + '&newTime=' + remindtime).then((response) => {
          if (remindtime === '-1') {
            window.alert('已关闭提醒功能')
          } else {
            window.alert('已设置提醒时间为：' + remindtime + '点')
          }
          this.$root.loadClientDate()
        }, (response) => {
          console.log('error to cancel')
        })
      }
    }
  }
</script>
