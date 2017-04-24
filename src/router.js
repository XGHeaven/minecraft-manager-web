import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Main from '@/components/Main'
import ServerIndex from '@/components/nav/server/Index'
import Server from '@/components/nav/server/Server'
import ServerLog from '@/components/nav/server/Log'
import JarIndex from '@/components/nav/jar/Index'
import SaveIndex from '@/components/nav/save/Index'
import Save from '@/components/nav/save/Save'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
      children: [{
        path: 'server',
        name: 'servers',
        component: ServerIndex
      }, {
        path: 'server/:serverName',
        name: 'server',
        component: Server,
        children: [{
          path: 'log',
          name: 'log',
          component: ServerLog
        }]
      }, {
        path: 'jar',
        name: 'jars',
        component: JarIndex
      }, {
        path: 'save',
        name: 'saves',
        component: SaveIndex
      }, {
        path: 'save/:saveName',
        name: 'save',
        component: Save
      }]
    }, {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  const server = localStorage.getItem('server')
  if (!server && to.name !== 'login') {
    return next('/login')
  }
  return next()
})

export default router
