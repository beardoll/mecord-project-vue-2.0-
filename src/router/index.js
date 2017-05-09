import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import SelfMaterial from '@/components/mine/SelfMaterial'
import Navigation from '@/components/Answers/Navigation'
import Answer from '@/components/Answers/Answer'
import Preview from '@/components/Answers/Preview'
import Modification from '@/components/Answers/Modification'
import Review from '@/components/Answers/Review'
import Outer from '@/components/homepage/Outer'
import Outline from '@/components/Outline'
import AddTask from '@/components/homepage/AddTask'
import Gate from '@/components/login/Gate'
import WithdrawTask from '@/components/homepage/WithdrawTask'
import TaskDetail from '@/components/homepage/TaskDetail'
import SetTask from '@/components/homepage/SetTask'
import TaskDetailFin from '@/components/homepage/TaskDetailFin'

Vue.use(Router)
Vue.use(VueResource)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Gate',
      component: Gate
    },
    {
      path: '/selfmaterial',
      name: 'SelfMaterial',
      component: SelfMaterial
    },
    {
      path: '/navigation',
      name: 'Navigation',
      component: Navigation
    },
    {
      path: '/answer',
      name: 'Answer',
      component: Answer
    },
    {
      path: '/preview',
      name: 'Preview',
      component: Preview
    },
    {
      path: '/modification',
      name: 'Modification',
      component: Modification
    },
    {
      path: '/outer',
      name: 'Outer',
      component: Outer
    },
    {
      path: '/outline',
      name: 'Outline',
      component: Outline
    },
    {
      path: '/review',
      name: 'Review',
      component: Review
    },
    {
      path: '/addtask',
      name: 'AddTask',
      component: AddTask
    },
    {
      path: '/withdrawtask',
      name: 'WithdrawTask',
      component: WithdrawTask
    },
    {
      path: '/taskdetail',
      name: 'TaskDetail',
      component: TaskDetail
    },
    {
      path: '/settask',
      name: 'SetTask',
      component: SetTask
    },
    {
      path: '/taskdetailfin',
      name: 'TaskDetailFin',
      component: TaskDetailFin
    },
    { path: '*', redirect: '/' }
  ]
})
