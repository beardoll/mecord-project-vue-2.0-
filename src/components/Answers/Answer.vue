<template>
  <div id="answer">
    <div class="anbody">
      <headtitle :name="questionset.title"></headtitle>
      <div class="am-progress am-progress-striped anprogressdiv">
        <div class="am-progress-bar am-progress-bar-success" id="anprogress" style="width: 0%">{{curindex}}/{{questionlength}}</div>
      </div>
      <div v-if="curindex < questionlength">
        <questionlist :question-item="questions[curindex]" :curindex="curindex" ref="qlist"></questionlist>
      </div>
      <div style="background-color:white" v-if = "curindex > 0 && curindex < questionlength" class="am-topbar am-topbar-fixed-bottom">
        <button type="button" class="pastpagebtn am-btn am-btn-lg am-btn-primary am-radius"
                style="margin-left:20px;margin-right:20px" @click.stop="backToPastOne(curindex)">上一题</button>
        <button type="submit" class="nextpagebtn am-btn am-btn-lg am-btn-primary am-radius"
                style="margin-left:20px;margin-right:20px" @click.stop="goToNextOne(curindex)">下一题</button>
      </div>
      <div style="background-color:white" v-if = "curindex === 0" class="am-topbar am-topbar-fixed-bottom">
        <button type="button" class="nextpagebtn2 am-btn am-btn-lg am-btn-primary am-radius" @click.stop="goToNextOne(curindex)">下一题</button>
      </div>
      <div v-if="curindex === questionlength">
        <p style="margin-top:100px;font-size:28px;color:red;background-color:white">恭喜您完成问卷！</p>
        <div class="am-topbar am-topbar-fixed-bottom">
          <button type="button" class="pastpagebtn3 am-btn am-btn-lg am-btn-primary am-radius"
                  style="margin-left:20px;margin-right:20px" @click.stop="backToPastOne(questionlength-1)">上一题</button>
          <button type="button" class="nextpagebtn3 am-btn am-btn-lg am-btn-primary am-radius"
                  style="margin-left:20px;margin-right:20px" @click.stop="preview()">预览问卷</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
    body{
        background-color:white;
    }
    #answer{
      background-color: white;
      margin: 0;
      width: 100%;
      height: 100%;
      padding: 0;
      .anbody {
        width: 100%;
        height: 100%;
        padding: 0 0 80px 0;
        overflow: scroll;
        /* 进度条 */
        .anprogressdiv {
          padding: 0;
          margin: 0;
          width: 100%;
        }
      }
    }
</style>
<script>
  import { eventHub } from '../../main.js'
  import questionlist from './QuestionList'
  import headtitle from '../public_component/head'

  export default {
    data () {
      return {
        curindex: 0,
        curanswerdata: '', // 当前问题的答案
        curanswerstate: '' // 当前问题的状态，为1表示填写正确，为0表示填写不正确
      }
    },
    components: {
      questionlist,
      headtitle
    },
    created: function () {
      eventHub.$on('thisanswer', (item) => {
        // 把当前问题的答案拿到手
        // dispatched from: QuestionList.vue -> dispatchAnswer
        this.curanswerdata = item
      })
      eventHub.$on('thisanswerstate', (item) => {
        // 把当前问题的答案状态拿到手
        // dispatched from: QuestionList.vue -> dispatchAnswer
        this.curanswerstate = item
      })
//      'thisanswer': function (item) {
//        // 把当前问题的答案拿到手
//        // dispatched from: QuestionList.vue -> dispatchAnswer
//        this.curanswerdata = item
//      },
//      'thisanswerstate': function (item) {
//        // 把当前问题的答案状态拿到手
//        // dispatched from: QuestionList.vue -> dispatchAnswer
//        this.curanswerstate = item
//      }
    },
    computed: {
      questionset: function () { // 问卷
        return this.$root.curquestionset
      },
      questions: function () {  // 题目
        return this.$root.curquestionset.questions
      },
      questionlength: function () { // 题目数量
        return this.$root.curquestionset.questions.length
      },
      finishedanswer: function () {  // 要提交的答案，默认值为空字符
        var temp = []
        for (var i = 0; i < this.questionlength; i++) {
          temp.push('')
        }
        return temp
      }
    },
    methods: {
      goToNextOne (index) {
        // 进入下一题
        // 需要先暂存当前题目的答案，再进入下一题
        var questionItem = this.questions[index]
        this.$refs.qlist.dispatchAnswer(questionItem)
        this.$nextTick(function () {  // 等待子组件把当前答案上传，需要注意异步的问题
          if (this.curanswerstate === false && questionItem.nullValidate === false) {
            window.alert('请正确完成此题')
          } else {
            this.curindex = this.curindex + 1
            var percent = this.curindex / this.questionlength * 100
            $('#anprogress').css('width', percent + '%')
            this.finishedanswer[this.curindex - 1] = this.curanswerdata  // 将当前答案录入
            if (this.curindex < this.questionlength) { // 如果下一个题目不是最后一题
              this.$nextTick(function () { // 等待下一个题目渲染出来
                var curanswerdefaultdata = this.finishedanswer[this.curindex]
                this.$refs.qlist.setDefaultValue(this.questions[this.curindex].type, curanswerdefaultdata)
              })
            }
          }
        })
      },
      backToPastOne (index) {
        // 返回上一题
        // 如果当前题不是最后一题，需要先暂存当前题目的答案，再返回上一题
        this.curindex = this.curindex - 1
        var percent = this.curindex / this.questionlength * 100
        $('#anprogress').css('width', percent + '%')  // 更新进度条信息
        if (index < this.questionlength - 1) {  // 还没到最后一题
          var questionItem = this.questions[index]  // 发生点击事件的题
          this.$refs.qlist.dispatchAnswer(questionItem)
          this.finishedanswer[index] = this.curanswerdata // 将当前答案压入堆栈中
        }
        this.$nextTick(function () {
          var curanswerdefaultdata = this.finishedanswer[this.curindex]  // 设置答案的默认值
          this.$refs.qlist.setDefaultValue(this.questions[this.curindex].type, curanswerdefaultdata)
        })
      },
      preview () { // 预览问卷
        eventHub.$emit('saveanswer', this.finishedanswer)
        this.$router.push('/preview')
      }
    }
  }
</script>
