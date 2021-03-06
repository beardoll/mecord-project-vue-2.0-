// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

export var eventHub = new Vue()

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data () {
    return {
      accesstoken: [],
      userData: [],  // 此处存放用户的个人资料以及tasks, questionSet数据,创建者
      curtask: '',   // 当前编辑的task
      currentanswer: [],      // 当前问卷的答案
      editindex: [],   // 当前修改答案的题目在问卷中的下标
      wxsignature: '',  // 微信签名，在顶级component获取
      curquestionset: '', // 当前问卷，可索引到questions一层
      currentsearch: [],   // 当前的搜索结果
      currentread: ''    // 当前删除的任务
    }
  },
  created: function () {
    // 所有的中间数据都存放于此
    eventHub.$on('markcurtask', (item) => {
      // 当前操作的任务
      // dispatched from: FirstPanel.vue -> goToNav()
      this.curtask = item
      // console.log(JSON.stringify(this.curtask))
    })
    eventHub.$on('markcurquestionset', (item) => {
      // 当前问卷
      // dispatched from: Navigation.vue -> goToFill()
      //                  TaskDetail.vue -> review()
      this.curquestionset = item
    })
    eventHub.$on('saveanswer', (item) => {
      // 保存现在已经完成的答案
      // dispatched from: Answer.vue -> preview()
      //                  TaskDetail.vue -> review()
      this.currentanswer = item
    })
    eventHub.$on('seteditindex', (index) => {
      // 当前修改答案的题目在问卷中的下标
      // dispatched from: Preview.vue -> edit(index)
      this.editindex = index
    })
    eventHub.$on('editanswer', (item) => {
      // 修改后的新答案
      // dispatched from: Modification.vue -> validModification()
      this.currentanswer[this.editindex] = item
    })
    eventHub.$on('curread', (item) => {
      // 存放当前删除的任务
      // dispatched from: FirstPanel.vue -> delete()
      //                  FinishedTask.vue -> detail(taskindex)
      this.currentread = item
    })
  },
  methods: {
    login: function (wxurl, data) {
      // 在此处使用wxurl注册微信api
      // 使用data中的userId，id来进行登陆
      // 在componets/login/Gate.vue中调用此函数
/*      this.accesstoken.userId = data.userId
      this.accesstoken.id = data.id */
      this.accesstoken.id = data
      this.accesstoken.userId = 1
      var geturl = 'https://api.mecord.cn/api/CoreModels/getJsConfig?url=' + wxurl
      this.$http.get(geturl).then((response) => {
        // 首先得到微信的签名
        this.wxsignature = response.body
      }, (response) => {
        console.log('cannot get signature')
        window.alert('cannot get signature')
        process.nextTick(this.loadClientData())
      })
      process.nextTick(this.loadClientData())    // 把用户数据加载
    },
    loadClientData () {
      // 加载用户数据
      this.$http.get('https://api.mecord.cn/api/MecordUsers/' + this.accesstoken.userId + '?filter=%7B%22include%22%3A%20%7B%22tasks%22%3A%20%7B%22submissions%22%3A%22questionSet%22%7D%7D%7D&access_token=' +
        // 这里include到"questionSet"那一层
        this.accesstoken.id).then((response) => {
          console.log('successfully!')
          this.userData = response.data  // 存放用户数据，子模块使用
          this.$router.push('/outline')  // 取完数据后跳转到"components/Outline.vue"，显示主界面
          // this.$router.push('/modification')
          // this.$router.push('/preview')
        }, (response) => {
          console.log('error!')
        })
    }
  }
})
