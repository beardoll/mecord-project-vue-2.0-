<template>
  <div id="outer">
    <div id="taskstateswitchbtn" style="background-color:white">
      <ul class="selectstate" id="changestate">
        <li class="leftstate" @click.stop=toggleState(0)>
          <span style="color:white">未完成</span></li><li class="rightstate" @click.stop=toggleState(1)>
        <span style="color:dodgerblue">已完成</span></li>
      </ul>
    </div>
    <div id="taskcontent">
      <unfinishedtasks v-if="state === 0"></unfinishedtasks>
      <finishedtasks v-if="state === 1"></finishedtasks>
    </div>
  </div>
</template>
<style lang="scss">
    body{
        background-color:white;
    }
    #outer {
      overflow: scroll;
      width: 100%;
      height: 100%;
      /* “已完成”与“未完成”任务状态切换 */
      #taskstateswitchbtn {
        width: 100%;
        height: 10%;
        /* 任务状态显示 */
        .selectstate {
          list-style-type: none;
          margin-bottom: 10px;
          padding-left: 0;
          padding-right: 0;
          padding-top: 8px;
          li {
            display: inline-block;
            border: solid 1px dodgerblue;
            padding-left: 15px;
            padding-right: 15px;
            padding-top: 3px;
            padding-bottom: 3px;
            text-align: center;
            cursor: pointer;
          }
          /* 未完成按钮 */
          .leftstate {
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
            background-color: dodgerblue;
          }
          /* 已完成按钮 */
          .rightstate {
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            background-color: white;
          }
        }
      }
      /* 任务具体内容（面板显示） */
      #taskcontent {
        width: 100%;
        height: 90%;
      }
    }
</style>
<script>
    import unfinishedtasks from './UnfinishedTasks'
    import finishedtasks from './FinishedTasks'
    export default{
      data () {
        return {
          state: 0
        }
      },
      components: {
        unfinishedtasks,
        finishedtasks
      },
      methods: {
        toggleState (tips) {
          this.state = tips
          $('#changestate li').each(function (index, element) {
            if (tips === index) {
              $(this).css({
                'background-color': 'dodgerblue'
              })
              $(this).children('span').css('color', 'white')
            } else {
              $(this).css({
                'background-color': 'white'
              })
              $(this).children('span').css('color', 'dodgerblue')
            }
          })
        }
      }
    }
</script>
