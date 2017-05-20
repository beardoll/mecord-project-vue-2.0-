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

   ```javascript
   setDefaultValue(questiontype, data)
   // This function is called in `Answer.vue`
   ```

3. common questions ('blank', 'select', 'multi_blank', 'multi_select')

   All answers here will be saved in the `<form>` module, we can get the contents by applying:
   ```javascript
   formjson = $('form').serializeArray()
   ```
   The above code was written in function `dispatchAnswer(questionItem)`
   After receving the content, you should transform its format to what we need. This operation can be found in the `switch` syntax`. In the following we list the answer format.

   | question style  |  answer format |
   | --------------- | ---------------|
   |      blank      |     ['16']     |
   |     select      |      [0]       |
   |   multi_blank   |   ['3', '4']   | 
   |   multi_select  |   [1, 2, 3]    |
   
   After transformation, you should dispatch the answer the its parent component `Answer.vue`.
   
   Here, the variable `status` indicates whether this question has been answered, in `Answer.vue`, we will use this sign to judge whether it's justifiable to move to next question.
