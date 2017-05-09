<template>
  <div id="withdrawtask">
    <headtitle name="意见反馈"></headtitle>
    <div class="alert">
      您将放弃任务：
      <div class="task">{{currenttitle}}</div>
    </div>
    <div class="questiontitle" style="text-align: left">请选择放弃此任务的原因</div>
    <table class="showtable am-table" style="margin:0;padding:0">
      <tbody>
        <tr v-for="item in endconditions">
          <td>{{item}}</td>
        </tr>
        <tr>
          <td> 其他 </td>
        </tr>
      </tbody>
    </table>
    <div style="display: none" id="others">
    <form class="am-form">
        <div class="am-form-group am-u-sm-10 am-u-sm-offset-1">
          <input name="others" type="text" width="100px" placeholder="请在此处输入原因">
        </div>
      </form>
    </div>
    <hr data-am-widget="divider" style="margin:0;padding:0" class="am-divider am-divider-default" />
    <div class="button">
      <div class="am-topbar am-topbar-fixed-bottom">
        <button type="button" class="pastpagebtn3 am-btn am-btn-lg am-btn-danger am-radius"
                style="margin-right:10px" @click.stop="validate()">确认放弃</button>
        <button type="button" class="nextpagebtn3 am-btn am-btn-lg am-btn-primary am-radius"
                style="margin-left:10px" @click.stop="cancel()">取消放弃</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  #withdrawtask{
    /* 问卷标题 */
    .questiontitle{
      padding: 10px 5px 10px 5px;
      color: chocolate;
      font-weight: bold;
    }
    /* 提示当前要删除的任务 */
    .alert{
      padding: 10px 5px 10px 5px;
      color: crimson;
      font-weight: bold;

    }
    /* 删除原因列表 */
    .showtable{
      tbody tr td {
        text-align: left;
        padding-left: 5px; /*使输入位置与边框有一定的偏移*/
      }
      /* 选中状态样式 */
      .selected{
        background-image: url('../../assets/gou.png');
        background-size: 24px, 24px;
        background-repeat: no-repeat;
        background-position: 95%;
      }
    }
  }
</style>

<script>
  import headtitle from '../public_component/head'
  export default{
    data () {
      return {

      }
    },
    computed: {
      currenttitle: function () {
        return this.$root.currentread.title
      },
      endconditions: function () {
        return this.$root.currentread.endConditions
      },
      taskid: function () {
        return this.$root.currentread.id
      }
    },
    components: {
      headtitle
    },
    mounted: function () {
      this.$nextTick(function () {
        var that = this  // 在jq函数中this关键字被屏蔽
        $('table tbody tr').on('click', function (event) {
          var target = event.target.parentNode       // HTML DOM对象
          var curindex = $('table tbody').children('tr').index(target)
          var conditionsnum = that.endconditions.length + 1  // 结束任务的理由数目
          $('table tbody tr').each(function (index, element) {
            // 查找被点击的对象，如果原来是选中状态，则点击后取消选中，反之亦然
            if (curindex === index) {
              if ($(this).children('td').hasClass('selected')) {
                if (curindex === conditionsnum - 1) {   // 其他
                  $('#others').hide()
                }
                $(this).children('td').removeClass('selected')
              } else {
                if (curindex === conditionsnum - 1) {   // 其他
                  $('#others').show()
                }
                $(this).children('td').addClass('selected')
              }
            }
          })
        })
      })
    },
    methods: {
      validate () {
        var answerarr = []
        var conditionsnum = this.endconditions.length + 1  // 结束任务的理由数目
        var that = this
        $('table tbody tr').each(function (index, element) {
          // 找出所有处于选中状态的选项
          if ($(this).children('td').hasClass('selected')) {
            if (index === conditionsnum - 1) {   // 其他
              var formjson = $('form').serializeArray()
              answerarr.push(formjson[0].value)
            } else {
              answerarr.push(that.endconditions[index])
            }
          }
        })
        this.$http.post('https://api.mecord.cn/api/Tasks/endTask?taskId=' + this.taskid, answerarr).then((response) => {
          window.alert('放弃任务成功！感谢您的意见反馈!')
          this.$root.loadClientDate()
        }, (response) => {
          console.log('抱歉，删除失败')
        })
      },
      cancel () {
        this.$router.push('/outline')
      }
    }
  }
</script>
