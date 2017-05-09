<template>
    <div id="preview">
      <div class="mask" v-if="showmask === true">
        <div class="maskprompt">
          <i class="am-icon-spinner am-icon-md am-icon-spin"></i>
          <p style="font-size:16px">提交中，请稍后，请勿关闭页面，耐心等待系统提示“提交成功”</p>
        </div>
      </div>
      <div class="prebody">
        <headtitle :name="questionset.title"></headtitle>
        <div class="toptips" style="padding-left:5px">点击<span class="am-icon-edit"></span>修改选项</div>
        <div v-for="(questionItem, index) in questions" class="questionbody">
          <div class="questiontitle">Q{{index+1}}:&nbsp;{{questionItem.title}}
            <span class="am-icon-edit" @click.stop="edit(index)" style="margin:auto;padding:auto"></span>
          </div>
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
            <img class="showimgarea" v-bind:src = "questionItem.answers">
          </div>
        </div>
      </div>
      <div class="submitbtn am-topbar am-topbar-fixed-bottom" style="background-color:white">
        <button class="am-btn am-btn-primary am-btn-radius" @click.stop="submit()">提交</button>
      </div>
    </div>
</template>
<style lang="scss">
    body{
        background-color:white;
    }
    /* 遮罩层 */
    .mask{
      left: 0;
      top: 0;
      position: fixed;
      width: 100%;
      height: 100%;
      z-index: 100;
      background-color: rgba(255, 255, 255, .75);
      .maskprompt{
        top: 50%;
        left: 50%;
        margin: -51px 0px 0px -101px;
        z-index: 1000;
        overflow: hidden;
        position: fixed !important;
        _position: absolute;
        width: 200px;
        height: 100px;
        color: black;
      }
    }
    #preview{
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
        /* 提示点击可修改答案 */
        .toptips{
          text-align: left;
          font-size: 16px;
        }
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
          /* 图片上传题样式 */
          .showimgarea{  /* 图片显示区域 */
            width: 150px;
            height: 200px;
            margin: 10px auto 0px auto;
          }
        }
      }
      /* 提交按钮 */
      .submitbtn{
        width: 100%;
        height: 10%;
      }
    }
</style>
<script>
  var wx = require('weixin-js-sdk')
  import headtitle from '../public_component/head'
  import Vue from 'vue'
  export default{
    data () {
      return {
        showmask: false  // 是否显示遮罩层
      }
    },
    components: {
      headtitle
    },
    computed: {
      answers: function () {  // 将答案转化为纯数字类型数据
        var currentanswer = this.$root.currentanswer
        var tempquest = this.$root.curquestionset.questions // 当前的所有问题，取它们的问题类型来分别操作
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
    mounted: function () {
      this.$nextTick(function () {
        wx.config({
          debug: false,
          appId: this.resbody.appId,          // 必填，公众号的唯一标识
          timestamp: this.resbody.timestamp,      // 必填，生成签名的时间戳
          nonceStr: this.resbody.nonceStr,      // 必填，生成签名的随机串
          signature: this.resbody.signature,      // 必填，签名，见附录1
          jsApiList: this.resbody.jsApiList       // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })
      })
    },
    methods: {
      edit (index) { // 修改index对应的题目
        var eventHub = new Vue()
        eventHub.$emit('seteditindex', index)   // 上传当前修改的问题在问卷中的下标
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
      },
      submit () {
        // 先上传非图片类问题的答案
        // 再上传图片
        // 提交表单数据
        // console.log(this.submission.answers)
        this.showmask = true   // 提交答案的时候先显示遮罩层
        var submitanswers = []
        var attachmentsurl = []
        var attachmentsquestionid = []
        console.log(this.answers)
        var i, j, k
        for (i = 0; i < this.questions.length; i++) {
          var temp = {}
          temp.userId = this.userId
          temp.questionId = this.questions[i].id
          temp.type = this.questions[i].type
          var content = {}
          var currentanswer = this.answers[i] // 当前问题对应的答案
          switch (this.questions[i].type) {
            case 'symptom_score':
              content.levelScore = currentanswer[0]
              content.frequencyScore = currentanswer[1]
              break
            case 'multi_blank':
              var data = []
              for (j = 0; j < currentanswer.length; j++) {
                data.push(currentanswer[j])
              }
              content.datas = data
              break
            case 'select':
              for (k = 0; k < currentanswer.length; k++) {
                if (currentanswer[k] === 1) {
                  content.select = k
                  break
                }
              }
              break
            case 'multi_select':
              var data2 = []
              for (k = 0; k < currentanswer.length; k++) {
                data2.push(currentanswer[k])
              }
              content.datas = data2
              break
            case 'blank':
              content.datas = currentanswer[0]
              break
            case 'upload_image':
              attachmentsquestionid.push(temp.questionId)
              attachmentsurl.push(currentanswer)
          }
          temp.content = content
          submitanswers.push(temp)
        }
        this.$http.post('https://api.mecord.cn/api/Submissions/' + this.submissions.id + '/answers', submitanswers).then(
          (response) => {
            var answerid = []
            var questionid = []
            var datax = response.body
            for (var kk = 0; kk < datax.length; kk++) {
              answerid.push(datax[kk].id)
              questionid.push(datax[kk].questionId)
            }
            var that = this
            var updatetaskid = that.task.id
            var updatetaskurl = 'https://api.mecord.cn/api/Tasks/' + updatetaskid
            var updateprogress = that.task.progress + 1
            var updatestate = ''
            if (updateprogress === that.task.plans.dates.length - 1) {
              updatestate = 'finished'
            } else {
              updatestate = 'unfinished'
            }
            if (attachmentsquestionid.length === 0) {  // 如果没有附件，直接更新状态
              // 更新submissions的status，然后更新task的progress
              that.$http.get('https://api.mecord.cn/api/Submissions/' + that.submissions.id).then((response) => {
                var updatesubmission = response.body
                updatesubmission.status = 'finished'
                updatesubmission.submitDate = new Date()
                updatesubmission.submitterId = that.userId
                that.$http.put('https://api.mecord.cn/api/Submissions/' + that.submissions.id, updatesubmission).then((response) => {
                  console.log('获得积分啦!')
                  that.$http.put(updatetaskurl, {'progress': updateprogress, 'status': updatestate}).then((response) => {
                    that.showmask = false     // 关闭遮罩层
                    that.$nextTick(function () {
                      console.log('sucessfully put!')
                      window.alert('提交成功啦！')
                      that.$root.loadClientDate()
                    })
                  }, (response) => {
                    console.log('fail put!')
                    window.alert(JSON.stringify(response.body))
                    window.alert('提交失败！')
                  })
                }, (response) => {
                  window.alert('获取积分失败！')
                })
              }, (response) => {
                console.log('cannot get submission')
              })
            } else {  // 否则，等附件上传完后再更新状态
              var uploadinfo = {}
              for (var jj = 0; jj < attachmentsquestionid.length; jj++) {   // 一个个图片附件进行上传
                var index = questionid.indexOf(attachmentsquestionid[jj]) // 附件问题在response对应的下标
                wx.uploadImage({
                  localId: attachmentsurl[jj].toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
                  isShowProgressTips: 1, // 默认为1，显示进度提示
                  success: function (res) {
                    var serverId = res.serverId.toString() // 返回图片的服务器端ID
                    uploadinfo.filename = that.userId + '&' + new Date().getTime()
                    uploadinfo.submitterId = that.userId
                    uploadinfo.urls = serverId
                    uploadinfo.desription = ''
                    uploadinfo.permission = 'public'
                    that.$http.post('https://api.mecord.cn/api/Answers/' + answerid[index] + '/attachments', uploadinfo).then((response) => {
                      if (jj === attachmentsquestionid.length) { // 等附件上传完后再更新状态，注意异步的问题，jj已经自加
                        // 更新submissions的status和task的progress
                        that.$http.get('https://api.mecord.cn/api/Submissions/' + that.submissions.id).then((response) => {
                          var updatesubmission = response.body
                          updatesubmission.status = 'finished'
                          updatesubmission.submitDate = new Date()
                          updatesubmission.submitterId = that.userId
                          that.$http.put('https://api.mecord.cn/api/Submissions/' + that.submissions.id, updatesubmission).then((response) => {
                            console.log('获得积分啦!')
                            that.$http.put(updatetaskurl, {'progress': updateprogress, 'status': updatestate}).then((response) => {
                              that.showmask = false  // 关闭遮罩层
                              that.$nextTick(function () {
                                console.log('sucessfully put!')
                                window.alert('提交成功啦！')
                                that.$root.loadClientDate()
                              })
                            }, (response) => {
                              console.log('fail put!')
                              window.alert(JSON.stringify(response.body))
                              window.alert('提交失败！')
                            })
                          }, (response) => {
                            window.alert('获取积分失败！')
                          })
                        }, (response) => {
                          console.log('cannot get submission')
                        })
                      }
                    }, (response) => {
                      window.alert(JSON.stringify(response.body))
                      console.log('fail to submit the src to the server!')
                      window.alert('fail to submit the src to the server!')
                    })
                  }
                })
              }
            }
          }, (response) => {
          console.log(JSON.stringify(submitanswers))
          console.log('fail to submit!')
          window.alert('fail to submit!')
        })
      }
    }
  }
</script>
