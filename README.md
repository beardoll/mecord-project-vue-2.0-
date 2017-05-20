# mecord-project-vue2.0
using vue 2.0 to implement the project

## How to debug in PC?

1. In `src/main.js`, focus on `methods/login`, uncomment the following sentences:
   ```javascript
   this.accesstoken.id = data    
   this.accesstoken.userId = 1  
   ```
  
2. then comment the following sentences:
   ```javascript
   this.accesstoken.userId = data.userId
   this.accesstoken.id = data.id
   ```
  
3. In `components/login/Gate.vue`, focus on script codes, then uncomment all the codes in `mounted` model. Also you should comment the `created` model together with the sentence:
   ```javascript
   var qs = require('querystring')
   ```
4. When debugging in PC, you should get the accesstoken at the backend and write the info into the `mounted` model of `components/login/Gate.vue`:
   ```javascript
   this.$root.login(wxurl, 'ez5vvico5xy020LMruUEZW7ed2xAW9u7RPap5YFINk3pNFlS6IDFYUf4VFErmjWI')  
   ```
5. After that, in terminal, use `cd` order to reach the root directory of the project, and run:
   ```Shell
   npm run dev
   ```
6. Remember that if you have not installed the dependencies modules, you should execute:
   ```Shell
   npm install
   ```
## The data flow of answers
1. Render the question

   In `components/Answers/QuestionList.vue`, you can see the disposals of questions and the corresponding answers. At the `<template>` module, you can see how we render the questions in vue component. Remember that in each component, we only render one question, which is decided by the conditional render syntax.

2. Two important functions in `method` module
 
   The function `setDefaultValue(questiontype, data)`
   
   ```javascript
   setDefaultValue(questiontype, data)
   // This function is called in parent 'Answer.vue', which aims to set the answers that users have filled right now.
   // It's important while we look back to the past questions.
   // It's called after the render of the component, which we will introduce later.
   // It's easy to comprehend the procedure of loading the varible 'data' to our component, for example
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
    // In the above we can see
    // First we tranform the data into 'int' format
    // Then we use the function '.each' in 'jQuery' to traverse all the options, and mark the option with index equal to 'checked index' as 'checked' in '$('input')' module, for other options we just label them as 'unchecked', then you can see 'data' is successfully rendered in '<template>'.
    // For some special questions, the render operation is a little more complicated, we will introduce it later.
   ```
   
   The function `dispatchAnswer(questionItem)`
   ```javascript
   dispatchAnswer(questionItem)
   // This function aims to dispatch the answers it collects to the parent component 'Answer.vue'
   // It's triggered by the parent component, when we click the button to move to next/past question
   // It uses 'eventHub'.
   // Two important variable:
   //    1. data: the content of the answer
   //    2. status: the sign to indicate whether the question has been finished
   ```
   
   To clearly show how it works, let's focus on the parent component `/components/Answers/Answer.vue`. Here we can find two methods, named `goToNextOne(index)` and `backToPastOne(index)`, respectively. Both of the methods apply `setDefaultValue(questiontype, data)` and `dispatchAnswer(questionItem)`. We just introduce `goToNextOne(index)`.
   
   ```javascript
   gotoNextOne(index)
   // It's triggered when we move to the next question
   // First we should save the answer of the current question
   this.$refs.qlist.dispatchAnswer(questionItem)
   // The answer will be sent to 'this.curanswerdata', you can see it in 'created' part:
   eventHub.$on('thisanswer', (item) => {
     this.curanswerdata = item
   })
   // This item will be saved into variable 'this.finishedanswer'
   // Then we change increase the index to questions by 1, then in <template> -- <questionlist>, the 'question-item' will be changed to the new question, and it will force the child component 'QustionList.vue' to render it.
   // We wait for the rendering using 'nextTick'
   // Then the new 'QuestionList' component has been rendered, and we can transport the data to it (if the new question has been accomplished in the past)
   var curanswerdefaultdata = this.finishedanswer[this.curindex]
   this.$refs.qlist.setDefaultValue(this.questions[this.curindex].type, curanswerdefaultdata) 
   // After that, the past answer will be rendered to the component 'QuestionList'
   ```

3. The diposal of common questions (`blank`, `select`, `multi_blank`, `multi_select`)

   All answers here will be saved in the `<form>` module, we can get the contents by applying:
   ```javascript
   formjson = $('form').serializeArray()
   ```
   The above code was written in function `dispatchAnswer(questionItem)`
   After receving the content, you should transform its format to what we need. This operation can be found in the `switch` syntax`. In the following we list the answer format (together with special questions).

   | question style  |  answer format |
   | --------------- | ---------------|
   |      blank      |     ['16']     |
   |     select      |     ['0']      |
   |   multi_blank   |   ['3', '4']   | 
   |   multi_select  | ['1', '2', '3']|
   |   symptom_score |   ['3', '5']   |
   |    upload_image | ['xxx'](path)  |

4. The disposal of `symptom_score` question

   We create a seperate component named `Score.vue` in the same directory, which accomplishes the task of: a. render the score bars. b. set the bars to the values indicated by `QuestionList.vue`.
   
   In fact, this kind of question is just the 'drop-down list', so we can set the value using `setSymptomScoreData(data)`:
   ```javascript
   setSymptomScoreData(data)
   // In this function we will change the style of the bar by changing the class
   // And the value will be set using:
   var selectedindex1 = 10 - datafigure[0] // option指定的选项在父组件中的位置
   $('#select1').val(10 - selectedindex1)
   // Remember that we use two bars, so we have '$select1' and '$select2'
   ```
   
   If we want to get the values of the bars, we just load the value as done in 'select-option' component.
   ```javascript
   formjson = $('form').serializeArray()   // In 'QuestionList.vue'
   ```
   
5. The disposal of `upload_image` question

   We also create a seperate component named `UploadImage.vue`. Here we use the api of wechat to take photos and get the path of the photos.
   ```javascript
   // First we should configure the api to get the authorization
   wx.config({...})
   // Then we use the function 'wx.chooseImage' to get the image that users choose
   success: function (res) {
     $('#img').attr('src', res.localIds)
     that.imgsrc = res.localIds
   }
   // note: the key words 'this' (originally point to Vue component) has been covered, so we should rename 'this' as 'that'
   // Then we can get the path in 'QuestionList.vue' by using:
   formjson = this.$refs.upimg.imgsrc     // In QuestionList.vue -> dispatchAnswer
   // To set the default path of image, we can use setDefaultImgSrc(data) in 'QuestionList.vue'
   this.$refs.upimg.setDefaultImgSrc(data)
   ```
   
