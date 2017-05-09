<template>
  <table class="am-table finishedtasktable am-table-bordered">
    <!-----------  已完成部分  ---------->
    <tbody>
      <tr v-for="(taskindex, index) in finished">
        <td>
          <div class="finfirstpanel">
            <div class = "am-g" style="margin:0;padding:0">
<!--              <span class="am-u-sm-7" style="margin:0;padding:0;text-align:left">
                <span class="fintasktitle">{{taskindex.title}}</span>
              </span>-->
              <span class="am-u-sm-7 fintasktitle">{{taskindex.title}}</span>
              <span class="am-u-sm-5 fincreator">调查人：{{taskindex.creator.nickname}}</span>
            </div>
            <div class="detail">
              <div class="am-u-sm-9 taskstatus">
                任务状态:<span style="font-size: 16px; color: royalblue" v-if="taskindex.status === 'finished'">[已完成]</span>
                <span style="font-size: 16px; color: crimson" v-if="taskindex.status === 'ended'">[中途放弃]</span>
              </div>
              <div class="am-u-sm-3 detailbutton">
                <button type="button" class="am-btn am-btn-success am-btn-sm" @click.stop="detail(taskindex)">详情</button>
              </div>
            </div>
            <div class="finsubmitdates">完成日期：{{submitdate[index]}}</div>
          </div>
          <div v-if="index !== finishedtasklength-1" class="divider"></div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<style lang="scss">
    body{
        background-color: white;
    }
    .finishedtasktable {
      margin: 0;
      padding: 0;
      tbody tr td{
        background-color: white;
        margin: 0;
        padding: 0; /* 上右下左 */
      }
      /* 任务之间有分割线 */
      .divider {
        width: 100%;
        height: 1px;
        background-color: #8a6343;
      }
      .finfirstpanel {
        margin: 0 0 10px 0;
        padding: 0;
        /*   任务标题   */
        .fintasktitle {
          font-size: 20px;
          text-align: left;
          margin: 0 0 0 0;
          padding: 0 0 0 5px;
          color: darkblue;
          font-family: 微软雅黑;
        }
        /* 问卷创建人 */
        .fincreator {
          text-align: right;
          margin: 10px 0 0 0;
          padding: 0 5px 0 0;
          color: black;
          font-size: 12px;
        }
        /* 问卷细节 */
        .detail{
          /* 问卷状态 */
          padding: 8px 0 5px 0;
          width: 100%;
          height: 40px;
          .taskstatus {
            font-size: 16px;
            text-align: left;
            padding: 5px 0px 5px 5px;
          }
          /* 详情按钮 */
          .detailbutton {
            text-align: right;
            button{
              margin-right: 20px;
            }
          }
        }
        /*  完成的日期 */
        .finsubmitdates {
          text-align: left;
          color: black;
          margin: 0;
          padding: 15px 0 0 5px;
          font-size: 14px;
        }
      }
    }
</style>
<script>
  import Vue from 'vue'
  export default{
    data () {
      return {
      }
    },
    computed: {
      finished: function () { // 已完成问卷
        var finishedtemp = []
        for (var i = 0; i < this.$root.userData.tasks.length; i++) {
          if (this.$root.userData.tasks[i].status === 'finished' || this.$root.userData.tasks[i].status === 'ended') {
            // 已完成问卷分为“已完成”和“中途放弃”两种
            console.log(this.$root.userData.tasks[i].status)
            finishedtemp.push(this.$root.userData.tasks[i])
          }
        }
        var finishedlist = []
        var endedlist = []
        var temp2 = {}
        var submitdate, day, month, year
        for (i = 0; i < finishedtemp.length; i++) {
          var colormark1 = 0
          var colormark2 = 0
          for (var k = 0; k < finishedtemp[i].submissions.length; k++) {
            if (finishedtemp[i].submissions[k].status === 'finished') {  // 已完成的
              temp2.finishedlistcolormark = colormark1
              if (colormark1 === 0) {
                colormark1 = 1
              } else {
                colormark1 = 0
              }
              temp2.questionsettitle = finishedtemp[i].submissions[k].questionSet.title
              temp2.number = k + 1
              temp2.submissionid = finishedtemp[i].submissions[k].id
              temp2.questionsetid = finishedtemp[i].plans.questionSets[k]
              submitdate = finishedtemp[i].submissions[k].submitDate
              submitdate = new Date(submitdate)
              day = submitdate.getDate()
              month = submitdate.getMonth() + 1
              year = submitdate.getFullYear() % 1000
              temp2.submitdate = year + '/' + month + '/' + day
              finishedlist.push(temp2)
              temp2 = {}
            } else {    // 中途放弃的
              temp2.unfinishedlistcolormark = colormark2
              if (colormark2 === 0) {
                colormark2 = 1
              } else {
                colormark2 = 0
              }
              temp2.questionsettitle = finishedtemp[i].submissions[k].questionSet.title
              temp2.number = k + 1
              submitdate = finishedtemp[i].submissions[k].submitDate
              submitdate = new Date(submitdate)
              day = submitdate.getDate()
              month = submitdate.getMonth() + 1
              year = submitdate.getFullYear() % 1000
              temp2.enddate = year + '/' + month + '/' + day
              endedlist.push(temp2)
              temp2 = {}
            }
          }
          finishedtemp[i].finishedlist = finishedlist
          finishedtemp[i].endedlist = endedlist
          finishedlist = []
          endedlist = []
        }
        return finishedtemp
      },
      finishedtasklength: function () {  // 已完成任务的数量，用来画分割线
        return this.finished.length
      },
      submitdate: function () {
        // 该任务完成日期，内含day, month和year三个属性
        var temp = []
        var sdate, temp1, day, month, year
        for (var i = 0; i < this.finished.length; i++) {
          sdate = this.finished[i].submissions[this.finished[i].submissions.length - 1].submitDate
          sdate = new Date(sdate)
          day = sdate.getDate()
          month = sdate.getMonth() + 1
          year = sdate.getFullYear()
          temp1 = year + '年' + month + '月' + day + '日'
          temp.push(temp1)
        }
        return temp
      }
    },
    methods: {
      detail (taskindex) {  // 查看详情
        var eventHub = new Vue()
        eventHub.$emit('curread', taskindex)
        this.$router.push('/taskdetailfin')
      }
    }
  }
</script>
