<template>
  <div id="unfinishedtasks">
    <table class="am-table tasktable" style="margin:0">
      <!-----------  未完成部分  ---------->
      <tbody>
      <tr>
        <td class="taskamount">
          <div class="am-u-sm-8" style="padding-left: 5px; margin:0">
            未完成任务数：{{unfinishedtasklength}}
          </div>
          <div class="am-u-sm-4" style="text-align: right" @click.stop="goToAddTask()">
            <img src="../../assets/plus.png" style="width:35px; height:35px"/>
          </div>
        </td>
      </tr>
      <tr v-show = !showdetail v-for="(taskitem, index) in minunfinishedtasks">
        <td>
          <div>
            <firstpanel :taskitem="taskitem" :taskindex="index" :progressname="minprogressname"></firstpanel>
          </div>
          <div v-if="index !== minunfinishedtasklength-1" class="divider"></div>
        </td>
      </tr>
      <tr v-show = showdetail v-for="(taskitem, index) in unfinished">
        <td>
          <div>
            <firstpanel :taskitem="taskitem" :taskindex="index" :progressname="progressname"></firstpanel>
          </div>
          <div v-if="index !== unfinishedtasklength-1" class="divider"></div>
        </td>
      </tr>
      <tr>
        <td v-if="!showdetail" style="font-size:12px;background-color:#9da0a4;cursor:pointer;
                  padding-top:5px;padding-bottom:5px" @click.stop="showdetail=true">查看更多任务</td>
        <td v-if="showdetail" style="font-size:12px;background-color:#9da0a4;cursor:pointer;
                  padding-top:5px;padding-bottom:5px" @click.stop="showdetail=false">收起</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<style lang="scss">
    body{
        background-color:white;
    }
    *{
      padding: 0;
      margin: 0;
    }
    #unfinishedtasks {
      width: 100%;
      height: 100%;
      .tasktable {
        width: 100%;
        tbody tr td {
        }
        /* 任务之间有一条分割线 */
        .divider {
          width: 100%;
          height: 1px;
          background-color: #8a6343;
        }
        /* 统计总任务数 */
        .taskamount {
          font-size: 20px;
          padding: 10px 0 10px 5px;
          text-align: left;
        }
      }
    }

</style>
<script>
    import firstpanel from './FirstPanel'
    export default{
      data () {
        return {
          showdetail: true, // 显示所有任务
          unfinishedstate: [],  // 各个任务的状态，0表示过期，1表示完成日期在将来
          showdropdown: false,
          mintasklength: 2,  // 面板收缩时显示的任务数
          minprogressname: 'minunfinishedprogress',  // 缩小版任务列表的进度条名字
          progressname: 'unfinishedprogress',  // 完整版任务列表的进度条名字
          unfinishedtasklength: 0   // 未完成的任务数，其真实计算在computed的"unfinished"中
        }
      },
      components: {
        firstpanel
      },
      computed: {
        unfinished: function () {
          // 未完成任务，计算各个子任务相对于当前日期的剩余日期等信息，以进行显示
          // unfinished.unfinishedlist: 未完成的子任务列表
          // unfinished.finishedlist: 已完成的子任务列表
          // unfinishedlist:  number -- 子任务编号 countdown -- 子任务倒计时（正数）
          //                  countdownstate -- 倒计时状态，为0表示过期，为1表示正好今天，为2表示明天以后
          //                  questionsettitle -- 子任务问卷标题  submissionid questionsetid
          //                  score: 若完成当前任务（下的子任务），可以获得的积分
          // finishedlist: questiontitle -- 问卷标题 number -- 子任务编号  submissionid questionsetid
          console.log('repeated?!!')
          var unfinishedtemp = []
          for (var k = 0; k < this.$root.userData.tasks.length; k++) {
            if (this.$root.userData.tasks[k].status === 'not-started' || this.$root.userData.tasks[k].status === 'unfinished') {
              // “未完成”有“未开始”和“未填写完”两种情况
              this.unfinishedtasklength++
              unfinishedtemp.push(this.$root.userData.tasks[k])
            }
          }
          for (var i = 0; i < unfinishedtemp.length; i++) {
            var temp = []
            var temp2 = []
            var mark  // 表格颜色标记，在TaskDetail中使用，是为了显示相间的颜色
            for (var j = 0; j < unfinishedtemp[i].plans.dates.length; j++) {
              // console.log(this.unfinished[i].progress)
              if (j < unfinishedtemp[i].progress) {
                // 这一部分是已经完成的子任务
                if (j === 0) {
                  mark = 0
                } else {
                  switch (mark) {
                    case 0:
                      mark = 1
                      break
                    case 1:
                      mark = 0
                      break
                  }
                }
                var finishedlist = {}
                finishedlist.colormark = mark
                finishedlist.questionsettitle = unfinishedtemp[i].submissions[j].questionSet.title
                finishedlist.number = j + 1
                finishedlist.submissionid = unfinishedtemp[i].submissions[j].id
                finishedlist.questionsetid = unfinishedtemp[i].plans.questionSets[j]
                var submitdate = unfinishedtemp[i].submissions[j].submitDate
                submitdate = new Date(submitdate)
                var day = submitdate.getDate()
                var month = submitdate.getMonth() + 1
                var year = submitdate.getFullYear() % 1000
                finishedlist.submitdate = year + '/' + month + '/' + day
                temp2.push(finishedlist)
              } else {
                // 这一部分是未完成的子任务
                if (j === unfinishedtemp[i].progress) {  // 取第一个unfinished的子任务的积分（所有子任务积分统一）
                  unfinishedtemp[i].score = unfinishedtemp[i].submissions[j].score
                  mark = 0
                } else {
                  switch (mark) {
                    case 0:
                      mark = 1
                      break
                    case 1:
                      mark = 0
                      break
                  }
                }
                var sdate = unfinishedtemp[i].startDate  // 任务开始时间
                sdate = new Date(sdate)
                sdate.setDate(sdate.getDate() + unfinishedtemp[i].plans.dates[j])
                var curdate = new Date()
                var msdiff = sdate.getTime() - curdate.getTime()        // 当前时间与开始时间的时间差
                var daysdiff = Math.ceil(msdiff / (24 * 3600 * 1000))   // 未完成的子任务与当前时间相差的天数
                var includeOuter = {}
                includeOuter.questionsettitle = unfinishedtemp[i].submissions[j].questionSet.title // 当前问卷的标题
                includeOuter.countdown = Math.abs(daysdiff)
                includeOuter.number = j + 1
                includeOuter.colormark = mark
                includeOuter.score = unfinishedtemp[i].submissions[j].score
                if (daysdiff < 0) {
                  includeOuter.countdownstate = 0 // 负数
                } else {
                  if (daysdiff === 0) {
                    includeOuter.countdownstate = 1 // 零
                  } else {
                    includeOuter.countdownstate = 2 // 正数
                  }
                }
                includeOuter.submissionid = unfinishedtemp[i].submissions[j].id // 每个问卷对应的submissionid
                includeOuter.questionsetid = unfinishedtemp[i].plans.questionSets[j]
                temp.push(includeOuter)
              }
            }
            if (temp[0].countdownstate === 0) {
              this.unfinishedstate.push(0)  // 当前任务的计划日期已过
            } else {
              this.unfinishedstate.push(1)  // 还没有到当前任务的计划日期
            }
            unfinishedtemp[i].unfinishedlist = temp
            unfinishedtemp[i].finishedlist = temp2
          }
          return unfinishedtemp
        },
        minunfinishedtasks: function () {
          // 未完成的任务的缩小版
          // 默认显示2-3个任务，即“缩小版”
          var temp = []
          for (var i = 0; i < this.unfinished.length; i++) {
            if (i < this.mintasklength) {
              temp.push(this.unfinished[i])
            }
          }
          return temp
        },
        minunfinishedtasklength: function () { // 未完成任务的缩小版长度（实际，可能比设定的短），用来规划分割线
          return this.minunfinishedtasks.length
        },
        score: function () {  // 任务积分

        }
      },
      methods: {
        expandSecondLayer (event) {  // 展开/收起第二层面板
          var target = event.target
          var $td = target.closest('td')
          var secondpanel = $($td).children('div').eq(2)
          secondpanel.toggle()
        },
        goToAddTask () {   // 添加问题
          this.$router.push('/addtask')
        }
      }
    }
</script>
