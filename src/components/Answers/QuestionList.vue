<template>
  <div id="questionlist">
    <label class="am-form-label questiontitle">Q{{curindex+1}}&nbsp;&nbsp;{{questionItem.title}}</label>
    <div v-for="(tipsitem, index) in questionItem.tips" class="questiontips">
      提示{{index+1}}:&nbsp;{{tipsitem}}
    </div>
    <div v-if="questionItem.type === 'blank' || questionItem.type === 'select' || questionItem.type === 'multi_select' ||
      questionItem.type === 'multi_blank' || questionItem.type === 'symptom_score'">
      <form class= "am-form" style="padding:0;margin:0">
        <div v-if="questionItem.type === 'blank'">
          <div class="am-form-group" style="text-align:left;margin-top:2px">
            <div class="am-g">
              <div class="am-u-sm-6" style="padding-left:0;margin-left:40px;margin-top:20px">
                <input :type="questionItem.content.dataType" :name="questionItem.title" class="blank_input">
              </div>
              <div class="am-u-sm-4 am-u-end" style="margin-top:20px" v-if="questionItem.content.zh_units !== ''">
                <span style="font-size:20px">{{questionItem.content.zh_units}}({{questionItem.content.symbol_units}})</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="questionItem.type === 'select'">
          <div class="am-form-group" style="text-align:left">
            <div style="margin-top:20px">
              <div class="am-radio" v-for="(selection, index) in questionItem.content.choice" style="padding-top:5px;padding-bottom:5px">
                <div class="am-g">
                  <div class="am-u-sm-1" style="margin:0;padding:0">
                    <input type = "radio" :name="questionItem.title" :value="index" style="margin-left:0px;
                                    width:18px;height:18px;margin-top:4px">
                  </div>
                  <div class="am-u-sm-11" style="margin:0;padding:0">
                    <span style="font-size:18px">{{selection}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="questionItem.type === 'multi_select'">
          <div class= "am-form-group am-g am-g-collapse" style="text-align:left">
            <div style="margin-top:20px">
              <div class="am-checkbox"  v-for="(selection, index) in questionItem.content.choice">
                <div class="am-g">
                  <div class="am-u-sm-1" style="margin:0;padding:0;text-align:right">
                    <input type= "checkbox" :name="questionItem.title" :value="index" style="padding-top:5px;padding-bottom:5px;
                                    margin-top:10px;width:18px;height:18px;margin-left:0px">
                  </div>
                  <div class="am-u-sm-11" style="margin:0;padding-top:6px;text-align:left">
                    <span style="font-size:18px">{{selection}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="questionItem.type === 'multi_blank'">
          <div class="am-form-group" style="text-align:left;margin-top:20px" >
            <div v-for = "(title, index) in questionItem.content.titles">
              <div class="am-g am-form-group" >
                <div class="am-u-sm-3" style="text-align:right;margin-top:2px">{{title}}</div>
                <div class="am-u-sm-4">
                  <input :type="questionItem.content.dataTypes[index]" style="margin-left:0" :name="questionItem.title" class="blank_input">
                </div>
                <div class="am-u-sm-5" style="text-align:left;margin-top:2px" v-if="questionItem.content.zh_units !== ''">{{questionItem.content.symbol_units[index]}}({{questionItem.content.zh_units[index]}})</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="questionItem.type === 'symptom_score'">
          <Score :question-item = "questionItem" ref="score"></Score>
        </div>
      </form>
    </div>
    <div v-if="questionItem.type === 'upload_image'">
      <uploadimg ref="upimg"></uploadimg>
    </div>
  </div>
</template>
<style lang="scss">
    body{
        background-color: white;
    }
    #questionlist{
      /* 问题标题 */
      .questiontitle{
        padding: 0 0 0 5px;
        font-size: 20px;
        text-align: left;
        background-color:#cccccc;
        width:100%;
      }
      /* 问题提示 */
      .questiontips{
        text-align: left;
        background-color: #fbedd9;
        padding: 0 0 0 5px;
        margin: 10px 0 0 0;
      }
    }
</style>
<script>
  import Score from './score'
  import uploadimg from './uploadimg'
  import { eventHub } from '../../main.js'
  export default{
    props: ['questionItem', 'curindex'],
    data () {
      return {
        imgsrc: ''  // 图片的本地地址
      }
    },
    components: {
      Score,
      uploadimg
    },
    mounted: function () {
      this.$nextTick(function () {
        $('.blank_input').keypress(function (e) {
          if (e.keyCode === 13) {
            e.preventDefault()
          }
        })
      })
    },
    methods: {
      setDefaultValue (questiontype, data) {
        // data: 问题的答案，字符形式
        switch (questiontype) {
          case 'multi_blank':
            if (data !== '') {  // 多项填空题，当答案不为空时
              $('input').each(function (index, element) {
                $(this).val(data[index])
              })
            } else {  // 当答案为空时
              $('input').each(function (index, element) {
                $(this).val('')
              })
            }
            break
          case 'select':
            if (data !== '') {  // 多项填空题，当答案不为空时
              var checkedindex = parseInt(data[0])  // json存的是字符而不是数字
              $('input').each(function (index, element) {
                if (index === checkedindex) {
                  $(this).prop('checked', true)
                } else {
                  $(this).prop('checked', false)
                }
              })
            } else {   // 当答案为空时
              $('input').each(function (index, element) {
                $(this).prop('checked', false)
              })
            }
            break
          case 'blank':
            $('input').val(data)
            break
          case 'multi_select':
            if (data !== '') { // 当答案不为空时
              var datafigure = []
              var temp = -1
              for (var i = 0; i < data.length; i++) { // 将字符数组转化为数字数组
                temp = parseInt(data[i])
                datafigure.push(temp)
              }
              $('input').each(function (index, element) {
                var mark = $.inArray(index, datafigure)
                if (mark === -1) {
                  $(this).prop('checked', false)
                } else {
                  $(this).prop('checked', true)
                }
              })
            } else {   // 当答案为空时
              $('input').each(function (index, element) {
                $(this).prop('checked', false)
              })
            }
            break
          case 'symptom_score':
            if (data !== '') {   // 当答案不为空时
              this.$refs.score.setSymptomScoreData(data)
            } else {   // 当答案为空时
              this.$refs.score.setSymptomScoreData([0, 0])
            }
            break
          case 'upload_image':
            this.$refs.upimg.setDefaultImgSrc(data)
            break
        }
      },
      dispatchAnswer (questionItem) {
        // 向父节点传送答案以及答案的状态（是否是合法答案）
        var formjson
        if (questionItem.type !== 'upload_image') {
          formjson = $('form').serializeArray()
        } else {
          formjson = this.$refs.upimg.imgsrc
        }
        var status = true
        var data = []
        var ww   // for循环计数变量
        switch (questionItem.type) {
          // 先检测是否完成输入
          case 'multi_blank':
            var blanklength = questionItem.content.titles.length
            for (ww = 0; ww < blanklength; ww++) {
              if (formjson[ww].value === '') {
                status = false
              }
              data.push(formjson[ww].value)
            }
            break
          case 'select':
            if (formjson.length === 0) {
              status = false
              data.push('')
            } else {
              data.push(formjson[0].value)
            }
            break
          case 'blank':
            if (formjson[0].value === '') {
              status = false
              data.push('')
            }
            data.push(formjson[0].value)
            break
          case 'multi_select':
            if (formjson.length === 0) {
              status = false
              data.push('')
            }
            for (ww = 0; ww < formjson.length; ww++) {
              data.push(formjson[ww].value)
            }
            break
          case 'upload_image':
            if (formjson === '') {
              status = false
            }
            data.push(formjson)
            break
          case 'symptom_score':
            data.push(formjson[0].value)
            data.push(formjson[1].value)
            break
        }
        eventHub.$emit('thisanswerstate', status)
        eventHub.$emit('thisanswer', data)
      }
    }
  }
</script>
