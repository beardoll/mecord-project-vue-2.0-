<template>
    <div id="modification">
      <div class="mobody">
        <headtitle :name="questionset.title"></headtitle>
        <div class="moquestion">
          <questionlist :question-item="questions[curindex]" :curindex="curindex" ref="qlist"></questionlist>
        </div>
      </div>
      <div style="margin-top:50px" class="am-topbar am-topbar-fixed-bottom">
        <button type="button" class="am-btn am-btn-lg am-btn-primary am-radius" @click.stop="validModification()">确认修改</button>
      </div>
    </div>
</template>
<style lang="scss">
    body{
        background-color:white;
    }
    #modification{
      background-color: white;
      margin: 0;
      width: 100%;
      height: 100%;
      padding: 0;
      .mobody{
        width: 100%;
        height: 100%;
        overflow: scroll;
        padding: 0 0 80px 0;
        /* 问卷题目 */
        .moquestion{
          width: 100%;
          margin: auto;
          padding: 0 0 60px 0;
        }
      }
    }
</style>
<script>
  import questionlist from './QuestionList'
  import headtitle from '../public_component/head'
  import { eventHub } from '../../main.js'
  export default{
    data () {
      return {
        curanswerdata: '', // 当前问题的答案
        curanswerstate: '' // 当前问题的状态，为1表示填写正确，为0表示填写不正确
      }
    },
    components: {
      questionlist,
      headtitle
    },
    created: function () {
      eventHub.$on('thisanswer', function (item) {
        // 把当前问题的答案拿到手
        // dispatched from: QuestionList.vue -> dispatchAnswer
        this.curanswerdata = item
      })
      eventHub.$on('thisanswerstate', function (item) {
        // 把当前问题的答案状态拿到手
        // dispatched from: QuestionList.vue -> dispatchAnswer
        this.curanswerstate = item
      })
      if (this.curquestion.type === 'symptom_score') {
        this.scoredefaultdata = this.curanswer
      }
      if (this.curquestion.type === 'upload_image') {
        this.imgsrcforchild = this.curanswer
      }
    },
    computed: {
      questionset: function () {
        return this.$root.curquestionset
      },
      questions: function () {
        return this.$root.curquestionset.questions
      },
      curindex: function () { // 当前编辑问题的位置
        return this.$root.editindex
      },
      curquestion: function () { // 当前编辑的具体问题
        return this.$root.curquestionset.questions[this.curindex]
      },
      curanswer: function () {  // 当前问题的答案
        return this.$root.currentanswer[this.curindex]
      }
    },
    mounted: function () {  // 先初始化答案
      this.$nextTick(function () {
        this.$refs.qlist.setDefaultValue(this.curquestion.type, this.curanswer)
      })
    },
    methods: {
      validModification () {
        var questionItem = this.curquestion
        this.$refs.qlist.dispatchAnswer(questionItem)
        this.$nextTick(function () {  // 等待子组件把当前答案上传，需要注意异步的问题
          if (this.curanswerstate === false && questionItem.nullValidate === false) {
            window.alert('请正确完成此题')
          } else {
            eventHub.$emit('editanswer', this.curanswerdata)
            this.$router.push('/preview')
          }
        })
      }
    }
  }
</script>
