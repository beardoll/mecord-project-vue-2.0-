<template>
  <div id="review">
    <div class="prebody">
      <headtitle :name="questionset.title"></headtitle>
      <div v-for="(questionItem, index) in questions" class="questionbody">
        <div class="questiontitle">Q{{index+1}}:&nbsp;{{questionItem.title}}</div>
        <div v-if="questionItem.type === 'blank'">
          <div class="blankstyle"> <span style="text-decoration:underline">{{questionItem.answers[0]}}</span>&nbsp;&nbsp;
            <span v-if="questionItem.content.zh_units !== ''">{{questionItem.content.zh_units}}({{questionItem.content.symbol_units}})</span> </div>
        </div>
        <div v-if="questionItem.type === 'select'">
          <div v-for="(selection, index) in questionItem.content.choice">
            <div class="selectedoption selectstyle" v-if="questionItem.answers[index] === 1">{{questionItem.content.choice[index]}}</div>
            <div class="notselectedoption selectstyle" v-if="questionItem.answers[index] === 0">{{questionItem.content.choice[index]}}</div>
          </div>
        </div>
        <div v-if="questionItem.type === 'multi_blank'">
          <div v-for = "(title, index) in questionItem.content.titles" class="multiblankstylediv">
            <div class="am-g am-form-group multiblankstyle" style="margin-top:0;margin-bottom:0;padding:0">
              {{title}}:&nbsp;&nbsp;<span style="text-decoration:underline">{{questionItem.answers[index]}}</span>&nbsp;&nbsp;
              <span v-if="questionItem.content.symbol_units[index] !== ''">{{questionItem.content.zh_units[index]}}({{questionItem.content.symbol_units[index]}})</span>
            </div>
          </div>
        </div>
        <div v-if="questionItem.type === 'multi_select'">
          <div v-for="(selection, index) in questionItem.content.choice" class="multiselectstylediv">
            <div class="selectedoption selectstyle" v-if="questionItem.answers[index] === 1">{{questionItem.content.choice[index]}}</div>
            <div class="notselectedoption selectstyle" v-if="questionItem.answers[index] === 0">{{questionItem.content.choice[index]}}</div>
          </div>
        </div>
        <div v-if="questionItem.type === 'symptom_score'">
          <div class="symptomtype">症状程度：<span style="text-decoration:underline">{{questionItem.answers[0]}}</span></div>
          <div class="symptomreftitle">症状程度值参考:</div>
          <div v-for = "(score, index) in questionItem.content.levelScores" class="symptomrefvalue">
            {{score}}:{{questionItem.content.levelParts[index]}}
          </div>
          <div class="symptomtype">频率：<span style="text-decoration:underline">{{questionItem.answers[1]}}</span></div>
          <div class="symptomreftitle">频率值参考:</div>
          <div v-for = "(score, index) in questionItem.content.frequencyScores" class="symptomrefvalue">
            {{score}}:{{questionItem.content.frequencyParts[index]}}
          </div>
        </div>
        <div v-if="questionItem.type === 'upload_image'">
          <div class="img_area">
            <button type="button" class="am-btn am-btn-primary">下载图片</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  body{
    background-color:white;
  }
  #review{
    background-color: white;
    margin: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    .prebody{
      width: 100%;
      height: 90%;
      margin: 0 0 40px 0;
      overflow: scroll;
    /* 问题预览部分 */
    .questionbody{
        padding-bottom: 20px;
      /* 问题标题 */
      .questiontitle{
        background-color: #9da0a4;
        text-align: left;
        font-size: 18px;
        padding: 0 0 0 5px;
      }
      /* 单项填空题样式 */
      .blankstyle{
        text-align: left;
        margin: 0 0 0 10px;
      }
      /* 单项选择题样式 */
      .selectstyle{
        text-align: left;
        margin: 0 0 0 10px;
      }
      .selectedoption{  /* 被选中的选项 */
        color: black;
      }
      .notselectedoption{ /* 没有被选中的选项 */
        color: darkgrey;
      }
      /* 评分题样式 */
      .symptomtype{ /* 症状程度/频率 */
        text-align: left;
        margin: 0 0 0 10px;
      }
      .symptomreftitle{ /* 症状值参考/频率值参考 */
        text-align: left;
        margin: 0 0 0 40px;
        color: #b94a48
      }
      .symptomrefvalue{  /* 各个参考值代表的程度 */
        text-align: left;
        margin: 0 0 0 60px;
        color: #b94a48
      }
      /* 多项填空题样式 */
      .multiblankstylediv{  /* 多项填空题，外框 */
        .multiblankstyle{
          text-align: left;
          margin: 0 0 0 10px;
        }
      }
      /* 图片区域，默认是一个按钮 */
      .img_area{
        margin: 20px 0 0 0;
      }
    }
  }
  }
</style>
<script>
  import headtitle from '../public_component/head'
  import Vue from 'vue'
  export default{
    data () {

    },
    components: {
      headtitle
    },
    computed: {
      answers: function () {  // 将答案转化为纯数字类型数据
        var currentanswer = this.$root.currentanswer.answers  // 取服务器的答案，不一定与问题的顺序对应
        var questionid = this.$root.currentanswer.questionid  // 服务答案对应问题id
        var tempquest = this.$root.curquestionset.questions // 这次问卷的所有问题，取它们的问题类型来分别操作

        // 首先将answer和questions一一对应起来
        var realquestionid = []  // 问卷的问题id，按顺序排
        for (var jj = 0; jj < tempquest.length; jj++) {
          realquestionid.push(tempquest[jj].id)
        }
        var indexarr = []  // 存放answers对应于realquestion的下标
        for (jj = 0; jj < tempquest.length; jj++) {
          indexarr.push(realquestionid.indexOf(questionid[jj]))
        }
        var tempanswer = []  // 答案按照问卷中的问题顺序进行排序
        var answerindex
        for (jj = 0; jj < tempquest.length; jj++) {
          answerindex = indexarr[jj]
          tempanswer.push(currentanswer[answerindex])
        }
        currentanswer = tempanswer

        var temp = []
        for (var i = 0; i < currentanswer.length; i++) {
          var temp1 = []
          var data1 = currentanswer[i]
          var data = []
          if (tempquest[i].type !== 'upload_image') {
            for (var ww = 0; ww < data1.length; ww++) { // 先把字符类型数据转化为数字
              data.push(parseInt(data1[ww]))
            }
          } else {
            data = data1
          }
          switch (tempquest[i].type) {
            case 'blank':
              temp1.push(data1)
              break
            case 'multi_blank':
              for (var j = 0; j < data.length; j++) {
                temp1.push(data1[j])
              }
              break
            case 'select':
              for (var k = 0; k < tempquest[i].content.choice.length; k++) {
                if (($.inArray(k, data)) === -1) {
                  temp1.push(0)
                } else {
                  temp1.push(1)
                }
              }
              break
            case 'multi_select':
              for (var kk = 0; kk < tempquest[i].content.choice.length; kk++) {
                if (($.inArray(kk, data)) === -1) {
                  temp1.push(0)
                } else {
                  temp1.push(1)
                }
              }
              break
            case 'symptom_score':
              temp1 = data
              break
            case 'upload_image':
              temp1 = data
              break
          }
          temp.push(temp1)
        }
        return temp
      },
      questionset: function () {
        return this.$root.curquestionset
      },
      questions: function () {
        var temp = this.$root.curquestionset.questions
        for (var i = 0; i < temp.length; i++) {
          temp[i].answers = this.answers[i]  // 把每道题的答案放到对应的问题中
        }
        return temp
      },
      submissions: function () {
        return this.$root.curtask.submissions[this.$root.curtask.progress]
      },
      resbody: function () {  // 微信签名
        return this.$root.wxsignature
      },
      userId: function () {  // 用户id，用来submit answers
        return this.$root.accesstoken.userId
      },
      task: function () { // 当前task
        return this.$root.curtask
      }
    },
    methods: {
      edit (index) { // 修改index对应的题目
        var eventHub = new Vue()
        eventHub.$emit('seteditindex', index)  // 上传当前修改的问题在问卷中的下标
        console.log(this.$root.currentanswer)
        this.$router.push('/modification')
      },
      checkselect (questionItem, index) {
        // 检查单选题中index对应的选项是否被选中
        if (questionItem.answers[0] === index) {
          console.log('true select!')
          return true
        } else {
          return false
        }
      },
      checkmultiselect (questionItem, index) {
        // 检查多选题中index对应的选项是否被选中
        var temp = questionItem.answers
        var mark = $.inArray(index, temp)
        if (mark === -1) {
          return false
        } else {
          return true
        }
      }
    }
  }
</script>
