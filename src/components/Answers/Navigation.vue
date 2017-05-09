<template>
    <div id="navigation">
      <div class="navbody">
        <img src="../../assets/hospital.jpg" style="margin:auto" id="logo">
          <hr data-am-widget="divider" style="width:70%;margin-left:auto;margin-right:auto;margin-top:10px" class="am-divider am-divider-default" />
        <p style="font-size:28px">{{title}}</p>
        <hr data-am-widget="divider" style="width:70%;margin:auto" class="am-divider am-divider-dotted" />
        <h5>{{description}}</h5>
<!--        <hr data-am-widget="divider" style="width:70%;margin:auto" class="am-divider am-divider-dotted" />
        <div class="avatar">
          <img :src="avatar"><span class="avatar_word">{{nickname}}</span>
        </div>-->
        <button type="button" class="am-btn am-btn-lg am-btn-primary am-radius"
                style="margin-top:40px" @click.stop="goToFill()">开始</button>
      </div>
    </div>
</template>
<style lang="scss">
    body{
        background-color: white;
    }
    #navigation{
      background-color: white;
      margin: 0;
      width: 100%;
      height: 100%;
      padding: 0;
      .navbody{
        width: 100%;
        height: 80%;
        padding: 10px 0 0 0;
      }
      .avatar{
        width: 180px;
        height: 50px;
        border-radius: 50px 0 0 50px;
        background-color: antiquewhite;
        margin: 20px auto;
        img{
          float: left;
          position: relative;
          margin: 0;
          padding: 0;
          width: 49px;
          height: 49px;
          border: solid 1px black;
          border-radius: 50px;
        }
        .avatar_word{
          float: left;
          position: relative;
          margin: 10px auto;
          padding: auto;
          font-size: large;
          display: inline-block;
          height: 50px;
          width: 130px;
          font-weight: bold;
        }
      }
    }
</style>
<script>
  import { eventHub } from '../../main.js'
  export default{
    data () {
      return {
        avatar: '',   // 创建者的头像
        nickname: '' // 创建者的昵称
      }
    },
    computed: {
      title: function () {
        // console.log(JSON.stringify(this.$root.userData))
        return this.$root.curtask.submissions[this.$root.curtask.progress].questionSet.title
      },
      description: function () {
        return this.$root.curtask.submissions[this.$root.curtask.progress].questionSet.description
      },
      questionsetid: function () {
        return this.$root.curtask.plans.questionSets[this.$root.curtask.progress]
      },
      creatorid: function () {
        return this.$root.curtask.creatorId
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        var logowidth = $('#logo').width()
        var logoheight = $('#logo').height()
        var ratio = logoheight / logowidth
        var maxwidth = 160
        $('#logo').css('width', maxwidth + 'px')
        $('#logo').css('height', maxwidth * ratio + 'px')
        console.log(this.creatorid)
/*        this.$http.get('https://api.mecord.cn/api/MecordUsers/' + this.creatorid).then((response) => {
          this.avatar = response.body.avatar
          this.nickname = response.body.nickname
        }, (response) => {
          console.log('cannot get the avatar!!')
        }) */
      })
    },
    created: function () {  // 在此处加载submissions数据

    },
    methods: {
      goToFill () {  // 点击开始按钮的时候，加载问卷下所有的问题
        var questionseturl = 'https://api.mecord.cn/api/QuestionSets/' + this.questionsetid + '?filter=%7B%22include%22%3A%22questions%22%7D'
        this.$http.get(questionseturl).then((response) => {
          // console.log(JSON.stringify(response.body))
          eventHub.$emit('markcurquestionset', response.body)
          this.$router.push('/answer')
        }, (response) => {
          console.log('cannot get questions!')
        })
      }
    },
    route: {
      data: function (transition) {
        transition.next()
      }
    }
  }
</script>
