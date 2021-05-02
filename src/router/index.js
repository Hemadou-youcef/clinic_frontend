import Vue from 'vue'
import VueRouter from 'vue-router'
// eslint-disable-next-line no-unused-vars
import store from '../store/index'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    // eslint-disable-next-line no-unused-vars
    beforeEnter : (to , from , next) => {
        if (store.state.authenticated){
          next({name : 'dashboard'})
        }else{
          next({name : 'login'})
        }
  },
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },{
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.

    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
    // eslint-disable-next-line no-unused-vars
    beforeEnter: (to, from , next) => {
        console.log(store.state.authenticated)
        if (store.state.authenticated){
          next({name : 'dashboard'})
        }else{
          next()
        }
    }

  },{
    path: '/dashboard',
    name: 'dashboard',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue'),
    beforeEnter: (to ,from , next ) => {
     if(store.state.authenticated){
         console.log('auth OK')
       next()
     }else{
         console.log('auth not OK')

         next({name : 'login'})
     }
  }
  },{
        path: '/appointments',
        name: 'appointment',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/agenda.vue'),
        beforeEnter: (to ,from , next ) => {
            if(store.state.authenticated){
                console.log('auth OK')
                next()
            }else{
                console.log('auth not OK')

                next({name : 'login'})
            }
        }
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
