# mecord-project-vue2.0
using vue 2.0 to implement the project

## The structure of the project
   All the components except the root component are written in `src/components`.
   * `Answers` -- Components about showing the questions, storing the answers and uploading the answers to the server, etc.
   * `homepage` -- Components about showing the details of tasks, adding new tasks, setting some status of tasks, etc.
   * `login` -- Components about the gate of the project, here is the first page you can see when you enter the project.
   * `mine` -- Components about showing the private information, users can modify their information.
   * `public_component` -- Components that are used frequently.

## How to debug in PC

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
   
6. If you want to distribute the project to the server, you should execute:
   ```Shell
   npm run build
   ```

7. Remember that if you have not installed the dependencies modules, you should execute:
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
   |    upload_image | ['xxx'] (path) |

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
   
## The communications between components
1. The usage of `eventHub`
   Here we use a global `eventHub` to transport data between different components. You can see the definition of the `eventHub` in `src/main.js`:
   ```javascript
   export var eventHub = new Vue()
   ```
   Then we can use this global `eventHub` to trigger a 'message sender':
   ```javascript
   eventHub.$emit(eventName, item)
   ```
   While triggering a 'message reciever', we can use:
   ```javascript
   eventHub.$on(eventName, (item) => {
      // Here you can save the item in current vue component, for example
      this.item = item
   })
   ```

2. Some tips in using `eventHub`
   * When triggering an `eventHub`, you should make sure that the 'sender' and 'receiver' are all rendered. A typical condition is, the 'sender' is the child component and the 'receiver' is the parent component. So if the relationship between 'sender' and 'reciever' is not parent-child relationship, I suggest that you store the message in the `root` component. Here our root component is defined in `src/main.js`. Then if you want to use the message in another component, you can just use:
      ```javascript
      item = this.$root.item
      ```
      Then the problem of cross-transportation is handled.
   
   * Remember that the `eventHub` is a global variable, so in any component using the variable, you should import it:
      ```javasript
      import { eventHub } from '../../main.js'
      ```
   
   * To clearly show the data transportation route, I suggest that in the 'reciever', you should show where the data comes from, for example:
      ```javascript
      // in main.js
      eventHub.$on('markcurtask', (item) => {
        // 当前操作的任务
        // dispatched from: FirstPanel.vue -> goToNav()
        this.curtask = item
        // console.log(JSON.stringify(this.curtask))
      })
      ```

## How to use the data in the server 

1. Save the data in the `root` component, see the method `loadClientDate()` (silly mistake in spelling...)

   ```javascript
   this.userData = response.data  // 存放用户数据，子模块使用   
   ```
   Here we just include the data in the layer of 'questionSet', the 'questions' data will be gained when the user want to finish the questionSet.

2. Pre-compute the data before rendering

   For example, in the page where we show the 'unfinished tasks', we should select the unfinished ones from the origin data. The operation is implemented in the `computed` part of `components/homepage/UnfinishedTasks.vue`. There are enough annotations about what we will do. The pre-computed data will be tranmitted to 'FirstPanel.vue' (child of 'UnfinishedTasks.vue') and 'TaskDetail.vue' (if the user requires to see the details of the task, it's no-parent). You can see the `<template>` module of `FirstPanel.vue` and `TaskDetail.vue` to get how we render the data. 
   
   And for `FinishedTask.vue`, it doesn't have child component, but it can redirect to 'TaskDetail.vue' to see some details of the finished tasks, so pre-compute operation is also required.
   
## How to upload the answers to the server

   See the function `submit()` in `components/Answers/Preview.vue`

1. Pre-compute the answer to the format designated by the server. If the answers include attachments, then we should do some trival things. First, attachments are bound to 'answer', so we should create an empty answer and store it in 'answers'. Then we should save the 'questionid' and the attachment information of the questions requiring attachments:

   ```javascript
   attachmentsquestionid.push(temp.questionId)
   attachmentsurl.push(currentanswer)
   ```
   
   After we submit the 'answers' to the server, we can get 'answers' from the server, then we can upload the attachments to 'answers':
   ```javascript
   this.$http.post('https://api.mecord.cn/api/Submissions/' + this.submissions.id + '/answers', submitanswers).then(
          (response) => {
            ...
            // Here we match 'answerid' and 'questionid'
            // If the questionid of attachment is in the index of 5 in question id
            // then it's answerid is asnwerid[5]
            for (var kk = 0; kk < datax.length; kk++) {
              answerid.push(datax[kk].id)
              questionid.push(datax[kk].questionId)
            }
            ...
          }
   ...       
   // to upload, we should use the wechat api, which will provide us with 'uploadinfo'
   that.$http.post('https://api.mecord.cn/api/Answers/' + answerid[index] + '/attachments', uploadinfo).then((response) => {...}
   
   ```
   
2. When we upload answers and attachments, we should update some status of the task:
   ```javascript
   updatesubmission.status = 'finished'
   updatesubmission.submitDate = new Date()
   updatesubmission.submitterId = that.userId
   that.$http.put('https://api.mecord.cn/api/Submissions/' + that.submissions.id, updatesubmission).then((response) => {
      ...
      that.$http.put(updatetaskurl, {'progress': updateprogress, 'status': updatestate})
      ...
   }
   ```

3. In `Preview.vue`, we create a mask to inform the user that his answer is being uploaded. The design of the mask can be found in `<template>`:

   ```html
    <div class="mask" v-if="showmask === true">
       <div class="maskprompt">
          <i class="am-icon-spinner am-icon-md am-icon-spin"></i>
          <p style="font-size:16px">提交中，请稍后，请勿关闭页面，耐心等待系统提示“提交成功”</p>
       </div>
    </div>
   ```
   
   It will cover the whole page, you can check the css style of the classes.

4. We use troublesome ways to upload the image. First, we use the weixin api to get the local address of the image and store it into answers. Then we post the address to the server, and the server should get the image by visiting weixin cloud. The main difficulty in uploading image directly to the server is the gramma check by Eslint, and Ali cloud api doesn't conform to the standard. If we can disable the Eslint, maybe we can solve the problem.


   
   
