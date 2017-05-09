<template>
  <div id="taskdetailfin">
    <headtitle name="任务详情"></headtitle>
    <div class="tasktitle">{{tasktitle}}</div>
    <div class="tasknote">{{tasknote}}</div>
    <div class="taskstatus">
      <span style="font-weight:bold;color: deepskyblue">当前任务状态：
        <span style="color: crimson" v-if="taskstatus === 'ended'">[中途放弃]</span>
        <span style="color: forestgreen" v-if="status === 'finished'">[已完成]</span>
      </span>
    </div>
    <div class="finished" style="padding: 5px 5px">
      <div style="font-weight: bold; text-align: left; color: coral;padding-left: 5px; font-size: 20px">已完成问卷情况</div>
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
          <td v-show="item.finishedlistcolormark === 0" style="background-color: lightskyblue">{{item.number}}</td>
          <td v-show="item.finishedlistcolormark === 0" style="background-color: lightskyblue" @click.stop="review(index)"><u>{{item.questionsettitle}}</u></td>
          <td v-show="item.finishedlistcolormark === 0" style="background-color: lightskyblue">{{item.submitdate}}</td>
          <td v-show="item.finishedlistcolormark === 1" style="background-color: lightcyan">{{item.number}}</td>
          <td v-show="item.finishedlistcolormark === 1" style="background-color: lightcyan" @click.stop="review(index)"><u>{{item.questionsettitle}}</u></td>
          <td v-show="item.finishedlistcolormark === 1" style="background-color: lightcyan">{{item.submitdate}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="ended" style="padding: 5px 5px">
      <div style="font-weight: bold; text-align: left; color: coral;padding-left: 5px; font-size: 20px">中途放弃的问卷</div>
      <hr data-am-widget="divider" style="margin:2px 0 8px 0;padding:0;width: 50%" class="am-divider am-divider-default" />
      <table class="am-table am-table-bordered">
        <thead>
        <tr>
          <th>序号</th>
          <th>问卷标题</th>
          <th>终止时间</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in endedlist" style="background-color: cornflowerblue">
          <td v-show="item.unfinishedlistcolormark === 0" style="background-color: lightskyblue">{{item.number}}</td>
          <td v-show="item.unfinishedlistcolormark === 0" style="background-color: lightskyblue"> {{item.questionsettitle}}</td>
          <td v-show="item.unfinishedlistcolormark === 0" style="background-color: lightskyblue">{{item.enddate}}</td>
          <td v-show="item.unfinishedlistcolormark === 1" style="background-color: lightcyan">{{item.number}}</td>
          <td v-show="item.unfinishedlistcolormark === 1" style="background-color: lightcyan">{{item.questionsettitle}}</td>
          <td v-show="item.unfinishedlistcolormark === 1" style="background-color: lightcyan">{{item.enddate}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss">
  #taskdetailfin{
    padding: 0 0 50px 0;
    /* 任务标题 */
    .tasktitle{
      font-size: 20px;
      color: darkblue;
      font-family: 微软雅黑;
    }
    /* 任务备注 */
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
  import Vue from 'vue'
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
        return this.$root.currentread.note
      },
      finishedlist: function () {
        return this.$root.currentread.finishedlist
      },
      tasktitle: function () {
        return this.$root.currentread.title
      },
      endedlist: function () {
        return this.$root.currentread.endedlist
      },
      taskstatus: function () {
        return this.$root.currentread.status
      }
    },
    methods: {
      review (index) {  // 查看已完成问卷
        var cursubmissionid = this.finishedlist[index].submissionid
        var curquestionsetid = this.finishedlist[index].questionsetid
        var k
        this.$http.get('https://api.mecord.cn/api/Submissions/' + cursubmissionid + '/answers').then((response) => {
          var curanswercontent = response.body
          var temp = []
          var temp2 = []
          for (var i = 0; i < curanswercontent.length; i++) {
            var temp4 = []
            temp2.push(curanswercontent[i].questionId)
            switch (curanswercontent[i].type) {   // 不同的题型数据存放的格式不统一
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
          console.log(JSON.stringify(curanswercontent))
          var eventHub = new Vue()
          eventHub.$emit('saveanswer', answerarr)  // 将答案上传到app.vue
          var questionseturl = 'https://api.mecord.cn/api/QuestionSets/' + curquestionsetid + '?filter=%7B%22include%22%3A%22questions%22%7D'
          this.$http.get(questionseturl).then((response) => {
            // console.log(JSON.stringify(response.body))
            eventHub.$emit('markcurquestionset', response.body)
            this.$router.push('/review')
          }, (response) => {
            console.log('cannot get questions!')
          })
        }, (response) => {
          console.log('cannot get the answers!')
        })
      }
    }
  }
</script>
