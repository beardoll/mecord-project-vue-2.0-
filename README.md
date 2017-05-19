# mecord-project-vue2.0
using vue 2.0 to implement the project

### How to debug in PC?

1. In `src/main.js`, focus on `methods/login`, uncomment the following sentences:
  ```javascript
  this.accesstoken.id = data    
  this.accesstoken.userId = 1  
  ```
  then comment the following sentences:
  ```javascript
  this.accesstoken.userId = data.userId
  this.accesstoken.id = data.id
  ```
  
2. In `components/login/Gate.vue`, focus on script codes, then uncomment all the codes in `mounted` model. Also you should comment the `created` model together with the sentence:
  ```javascript
  var qs - require('querystring')
  ```
