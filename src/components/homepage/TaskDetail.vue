<template>
  <div id="taskdetail">
    <headtitle name="任务详情"></headtitle>
    <div class="tasktitle">{{tasktitle}}</div>
    <div class="tasknote">{{tasknote}}</div>
    <div class="taskstatus"><span style="font-weight:bold;color: deepskyblue">当前任务状态：</span>
      <span class="taskdeadline" v-if="taskstate === 0">
            已过期<span style="color:red">{{timediff}}天</span></span>
      <span class="taskdeadline" v-else-if="taskstate === 1 && timediff > 0">
            <span style="color:blue">{{timediff}}天</span>后需要填写</span>
      <span class="taskdeadline" v-else-if="taskstate === 1 && timediff === 0">
        <span style="color:blue">今天</span>需要填写
      </span>
    </div>
    <div class="unfinished" style="padding: 5px 5px; margin-top: 10px">
      <div style="font-weight: bold; text-align: left; color: coral;padding-left: 5px; font-size: 20px">未完成问卷</div>
      <hr data-am-widget="divider" style="margin:2px 0 8px 0;padding:0;width: 50%" class="am-divider am-divider-default" />
      <table class="am-table am-table-bordered">
        <thead>
          <tr>
            <th>序号</th>
            <th style="text-align: center">问卷标题</th>
            <th>开始时间</th>
            <th>奖励</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in unfinishedlist">
            <td v-show="unfinishedlistcolormark[index] === 0" style="background-color: lightskyblue">{{item.number}}</td>
            <td v-show="unfinishedlistcolormark[index] === 0" style="background-color: lightskyblue">{{item.questionsettitle}}</td>
            <td v-show="unfinishedlistcolormark[index] === 0 && item.countdownstate === 0" style="color: crimson;background-color: lightskyblue">{{item.countdown}}天前</td>
            <td v-show="unfinishedlistcolormark[index] === 0 && item.countdownstate === 1" style="color: forestgreen;background-color: lightskyblue">今天</td>
            <td v-show="unfinishedlistcolormark[index] === 0 && item.countdownstate === 2" style="color: dimgray;background-color: lightskyblue">{{item.countdown}}天后</td>
            <td v-show="unfinishedlistcolormark[index] === 0" style="background-color: lightskyblue">{{item.score}}</td>
            <td v-show="unfinishedlistcolormark[index] === 1" style="background-color: lightcyan">{{item.number}}</td>
            <td v-show="unfinishedlistcolormark[index] === 1" style="background-color: lightcyan">{{item.questionsettitle}}</td>
            <td v-show="unfinishedlistcolormark[index] === 1 && item.countdownstate === 0" style="color: crimson;background-color: lightcyan">{{item.countdown}}天前</td>
            <td v-show="unfinishedlistcolormark[index] === 1 && item.countdownstate === 1" style="color: deepskyblue;background-color: lightcyan">今天</td>
            <td v-show="unfinishedlistcolormark[index] === 1 && item.countdownstate === 2" style="color: dimgray;background-color: lightcyan">{{item.countdown}}天后</td>
            <td v-show="unfinishedlistcolormark[index] === 1" style="background-color: lightcyan">{{item.score}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="finished" style="padding: 5px 5px">
      <div style="font-weight: bold; text-align: left; color: coral;padding-left: 5px; font-size: 20px">已完成问卷</div>
      <hr data-am-widget="divider" style="margin:2px 0 8px 0;padding:0;width: 50%" class="am-divider am-divider-default" />
      <table class="am-table am-table-bordered">
        <thead>
        <tr>
          <th>序号</th>
          <th>问卷标题</th>
          <th>完成时间</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in finishedlist" style="background-color: cornflowerblue">
            <td v-show="finishedlistcolormark[index] === 0" style="background-color: lightskyblue">{{item.number}}</td>
            <td v-show="finishedlistcolormark[index] === 0" style="background-color: lightskyblue" @click.stop="review(index)"><u>{{item.questionsettitle}}</u></td>
            <td v-show="finishedlistcolormark[index] === 0" style="background-color: lightskyblue">{{item.submitdate}}</td>
            <td v-show="finishedlistcolormark[index] === 1" style="background-color: lightcyan">{{item.number}}</td>
            <td v-show="finishedlistcolormark[index] === 1" style="background-color: lightcyan" @click.stop="review(index)"><u>{{item.questionsettitle}}</u></td>
            <td v-show="finishedlistcolormark[index] === 1" style="background-color: lightcyan">{{item.submitdate}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="am-topbar am-topbar-fixed-bottom">
      <button type="button" class="pastpagebtn3 am-btn am-btn-lg am-btn-primary am-radius" style="margin-right:15px" @click.stop="settask()">设置</button>
      <button type="button" class="nextpagebtn3 am-btn am-btn-lg am-btn-danger am-radius" style="margin-left:15px" @click.stop="end()">放弃</button>
    </div>
  </div>
</template>

<style lang="scss">
  #taskdetail{
     padding: 0 0 50px 0;
    /* 任务标题 */
    .tasktitle{
      font-size: 20px;
      color: darkblue;
      font-family: 微软雅黑;
    }
    /* 备注 */
    .tasknote{
      background-color: #fbedd9;
      width: 100%;
      font-size:14px;
      color: black;
      text-align: left;
      padding: 5px 0px 5px 10px;
    }
    /* 任务状态(过期，还没到？) */
    .taskstatus{
      font-size: 14px;
      text-align: left;
      padding: 10px 0px 10px 10px;
    }
    table thead tr th{
      text-align: center;
    }
  }
</style>

<script>
  import headtitle from '../public_component/head'
  import { eventHub } from '../../main.js'
  export default{
    data () {
      return {

      }
    },
    components: {
      headtitle
    },
    computed: {
      tasknote: function () {
        // 任务标注
        return this.$root.currentread.note
      },
      unfinishedlist: function () {
        // 未完成的子任务列表
        return this.$root.currentread.unfinishedlist
      },
      finishedlist: function () {
        // 已完成的子任务列表
        return this.$root.currentread.finishedlist
      },
      tasktitle: function () {
        // 任务标题
        return this.$root.currentread.title
      },
      timediff: function () {
        // 问卷的开始时间与当前时间相差的天数
        return this.$root.currentread.unfinishedlist[0].countdown
      },
      taskstate: function () {
        // 任务的状态，分为过期（0）以及未过期（1）
        if (this.$root.currentread.unfinishedlist[0].countdownstate === 0) { // 过期
          return 0
        } else {
          return 1
        }
      },
      unfinishedlistcolormark: function () {
        // 未完成的子任务的colormark，蓝白相间
        var mark = []
        for (var i = 0; i < this.$root.currentread.unfinishedlist.length; i++) {
          mark.push(this.$root.currentread.unfinishedlist[i].colormark)
        }
        return mark
      },
      finishedlistcolormark: function () {
        // 已完成的子任务的colormark，蓝白相间
        var mark = []
        for (var i = 0; i < this.$root.currentread.finishedlist.length; i++) {
          mark.push(this.$root.currentread.finishedlist[i].colormark)
        }
        return mark
      }
    },
    methods: {
      review (index) {  // 查看已完成问卷
        var cursubmissionid = this.finishedlist[index].submissionid
        var curquestionsetid = this.finishedlist[index].questionsetid
        this.$http.get('https://api.mecord.cn/api/Submissions/' + cursubmissionid + '/answers').then((response) => {
          console.log(JSON.stringify(response.body))
          var curanswercontent = response.body
          var temp = []    // 存放问卷中各个题目的答案
          var temp2 = []   // 存放问卷中各个问题的id(questionid)
          var k
          for (var i = 0; i < curanswercontent.length; i++) {
            var temp4 = []
            temp2.push(curanswercontent[i].questionId)
            switch (curanswercontent[i].type) {
              // 不同的题型数据存放的格式不统一
              // 需要转化成我们需要的数据格式，便于显示
              // 具体而言： 1. 'blank'  -- 纯文本，直接取datas来显示即可
              //            2. 'select' -- 单选题，取选项的下标，即select即可
              //            3. 'multi_select'  -- 多选题，取所选项的下标并按顺序存为数组，比如选择了B和C，则在本地应保存为[1,2]
              //            4. 'multi_blank'   -- 多项提空题，取每个空的内容即可
              //            5. 'symptom_score' -- 程度选择题，将其两个属性levelScore和frequencyScore分别取出，并且依次存入数组即可
              //            6. 'upload_image'  -- 上传的图片，暂时设置为空，即不在本地显示
              case 'blank':
                temp4.push(curanswercontent[i].content.datas)
                break
              case 'select':
                temp4.push(curanswercontent[i].content.select)
                break
              case 'multi_select':
                for (k = 0; k < curanswercontent[i].content.datas.length; k++) {
                  if (curanswercontent[i].content.datas[k] === 1) {
                    temp4.push(k)
                  }
                }
                break
              case 'multi_blank':
                for (var kk = 0; kk < curanswercontent[i].content.datas.length; kk++) {
                  temp4.push(curanswercontent[i].content.datas[kk])
                }
                break
              case 'symptom_score':
                temp4.push(curanswercontent[i].content.levelScore)
                temp4.push(curanswercontent[i].content.frequencyScore)
                break
              case 'upload_image':
                temp4.push('')
                break
            }
            temp.push(temp4)
          }
          var answerarr = {}
          answerarr.answers = temp
          answerarr.questionid = temp2
          eventHub.$emit('saveanswer', answerarr)  // 将答案上传到root组件中
          var questionseturl = 'https://api.mecord.cn/api/QuestionSets/' + curquestionsetid + '?filter=%7B%22include%22%3A%22questions%22%7D'
          this.$http.get(questionseturl).then((response) => {
            // 把答案所对应的问题取出来，并且上传到root组件中
            // console.log(JSON.stringify(response.body))
            eventHub.$emit('markcurquestionset', response.body)
            this.$router.push('/review')
          }, (response) => {
            console.log('cannot get questions!')
          })
        }, (response) => {
          console.log('cannot get the answers!')
        })
      },
      end () {      // 暂停当前任务
        this.$router.push('/withdrawtask')
      },
      settask () {  // 设置任务属性
        this.$router.push('/settask')
      }
    }
  }
</script>
