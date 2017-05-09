<template>
  <div class="firstpanel">
    <div style="text-align:left" class="am-g">
      <span class="am-u-sm-7 tasktitle">{{title}}</span>
      <span class="establisher am-u-sm-5">调查人：{{creator}}</span>
    </div>
    <div class="am-g" style="margin-top:10px">
      <div class="am-u-sm-9" style="text-align:left;padding-top:10px;padding-left:0">
        <span class="taskdeadline" v-if="taskstate === 0">
          过期：<span style="color:red">{{timediff}}天</span></span>
        <span class="taskdeadline" v-if="taskstate === 1 && timediff > 1">
          离最近任务剩余：<span style="color:blue">{{timediff}}天</span></span>
        <span class="taskdeadline" v-if="taskstate === 1 && timediff <= 1">
          离最近任务剩余：<span style="color:red"> {{timediff}}天</span></span>
      </div>
        <span class="gobutton am-u-sm-3" v-if="taskstate === 0 || taskstate === 1 && timediff === 0">
          <button class="am-btn am-btn-primary am-radius am-btn-sm" @click.stop="goToNav()">填写</button>
        </span>
        <span class="gobutton am-u-sm-3" v-if="taskstate === 1 && timediff >= 1">
          <button class="am-btn am-btn-primary am-radius am-btn-sm" @click.stop="goToNav()" disabled = "disabled">填写</button>
        </span>
    </div>
    <div class="scoretips" style="height: 50px; padding-top: 8px">
      <div class="am-u-sm-9" style="margin:0; padding-left: 5px;padding-top: 5px">
        完成当前任务可获得积分：{{score}}<img src="../../assets/score.png" style="width: 20px; height: 20px; margin-left: 5px">
      </div>
      <div class="am-u-sm-3 gobutton">
        <button class="am-btn am-btn-success am-radius am-btn-sm" @click.stop="readdetail()">详情</button>
      </div>
    </div>
    <div class="am-progress am-progress-striped taskprogress" style="margin-bottom: 5px">
      <div class="am-progress-bar am-progress-bar-success" :id="progressname+taskindex">{{taskprogress}}/{{allsubtaskamount}}</div>
    </div>
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
  .firstpanel { /* 第一层面板 */
    background-color: white;
    margin: 0;
    padding: 0;
    /*   任务标题   */
    .tasktitle {
      font-size: 20px;
      color: darkblue;
      font-family: 微软雅黑;
      margin: 0;
      padding: 0 0 0 5px;
    }
    /* 创建者 */
    .establisher {
      color: black;
      font-size: 12px;
      text-align: right;
      margin: 10px 0 0 0;
    }
    /* 任务剩余天数 */
    .taskdeadline {
      text-align: left;
      font-size: 12px;
      padding: 0;
      margin: 10px 0 5px 7px;
      span { /* 具体天数上加个椭圆边框 */
        padding: 5px 10px;
        border: solid 1px black;
        border-radius: 5px;
        text-align: left;
      }
    }
    /* 填写按钮的样式 */
    .gobutton {
      text-align: right;
      padding: 3px 5px 0 0;
      font-size: 12px;
      color: blue;
      button {
        margin-right: 3px;
      }
    }
    /* 积分提示 */
    .scoretips{
      font-size: 14px;
      text-align: left;
      margin: 0;
      padding: 10px 0px 10px 0px;
    }
    /* 任务进度条 */
    .taskprogress {
      padding: 0;
      margin: 5px 0 0 0;
    }
  }
</style>
<script>
  import Vue from 'vue'
  export default{
    props: ['taskitem', 'taskindex', 'progressname'],
    // progressname: 用来标识进度条的id
    // taskindex: 用来标识进度条的id
    data () {
      return {
      }
    },
    computed: {
      title: function () {
        return this.taskitem.title
      },
      creator: function () {
        return this.taskitem.creator.nickname
      },
      timediff: function () {
        return this.taskitem.unfinishedlist[0].countdown
      },
      score: function () {
        return this.taskitem.unfinishedlist[0].score
      },
      taskprogress: function () {
        return this.taskitem.progress
      },
      allsubtaskamount: function () {
        return this.taskitem.plans.dates.length
      },
      taskstate: function () {
        if (this.taskitem.unfinishedlist[0].countdownstate === 0) { // 过期
          return 0
        } else {
          return 1
        }
      },
      submissionid: function () {
        return this.taskitem.submissions[this.taskitem.progress].id
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.showProgress()
      })
    },
    methods: {
      goToNav () { // 去填写问卷
        var eventBus = new Vue()
        eventBus.$emit('markcurtask', this.taskitem)
        this.$router.push('/navigation')
      },
      showProgress () {
        $('#' + this.progressname + this.taskindex).css('width', (this.taskprogress) / this.allsubtaskamount * 100 + '%')
      },
      readdetail () {
        var eventHub = new Vue()
        eventHub.$emit('curread', this.taskitem)
        this.$router.push('/taskdetail')
      }
    }
  }
</script>
