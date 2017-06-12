import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import SelfMaterial from '@/components/individual/selfmaterial'
import Navigation from '@/components/answers/navigation'
import Answer from '@/components/answers/answer'
import Preview from '@/components/answers/preview'
import Modification from '@/components/answers/modification'
import Review from '@/components/answers/review'
import Outer from '@/components/homepage/outer'
import Outline from '@/components/outline'
import AddTask from '@/components/homepage/addtask'
import Gate from '@/components/login/gate'
import WithdrawTask from '@/components/homepage/withdrawtask'
import TaskDetail from '@/components/homepage/taskdetail'
import SetTask from '@/components/homepage/settask'
import TaskDetailFin from '@/components/homepage/taskdetailfin'

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
