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
         store.commit('setNavBarTitle' , 'Dashboard')
       next()
     }else{
         console.log('auth not OK')

         next({name : 'login'})
     }
  }
  }, {
        path: '/appointments',
        name: 'appointments',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/agenda.vue'),
        beforeEnter: (to ,from , next ) => {
            if(store.state.authenticated){
                store.commit('setNavBarTitle' , 'Appointments')
                next()
            }else{
                console.log('auth not OK')

                next({name : 'login'})
            }
        }
    },
    {
        path: '/patients',
        name: 'patients',
        component: () => import(/* webpackChunkName: "about" */ '../views/Patients.vue'),
        beforeEnter: (to ,from , next ) => {
            if(store.state.authenticated){
                next()
                store.commit('setNavBarTitle' , 'Patients')
            }else{
                console.log('auth not OK')

                next({name : 'login'})
            }
        }
    },
    {
        path: '/patients/:id',
        name: 'patient',

        component: () => import(/* webpackChunkName: "about" */ '../views/Patient.vue'),
        beforeEnter: (to ,from , next ) => {
            if(store.state.authenticated){
                store.commit('setNavBarTitle' , 'Patient info')

                next()
            }else{
                console.log('auth not OK')

                next({name : 'login'})
            }
        }
    },
    {
        path: '/medicines',
        name: 'medicines',
        component: () => import(/* webpackChunkName: "about" */ '../views/Medicines.vue'),
        beforeEnter: (to ,from , next ) => {
            if(store.state.authenticated){
                store.commit('setNavBarTitle' , 'Medicines')
                next()
            }else{
                console.log('auth not OK')

                next({name : 'login'})
            }
        }
    },
    {
        path: '/consultations',
        name: 'consultations',
        component: () => import(/* webpackChunkName: "about" */ '../views/Consultations.vue'),
        beforeEnter: (to ,from , next ) => {
            if(store.state.authenticated){
                store.commit('setNavBarTitle' , 'Consultations')
                next()
            }else{
                console.log('auth not OK')

                next({name : 'login'})
            }
        }
    },
    {
        path: '/consultations/:id',
        name: 'consultation',

        component: () => import(/* webpackChunkName: "about" */ '../views/Consultation.vue'),
        beforeEnter: (to ,from , next ) => {
            if(store.state.authenticated){
                store.commit('setNavBarTitle' , 'Consultation')

                next()
            }else{
                console.log('auth not OK')

                next({name : 'login'})
            }
        }
    },
    {
        path: '/statistics',
        name: 'statistics',
        component: () => import(/* webpackChunkName: "about" */ '../views/Statistics.vue'),
        beforeEnter: (to ,from , next ) => {
            if(store.state.authenticated){
                next()
            }else{
                console.log('auth not OK')

                next({name : 'login'})
            }
        }
    },
    {
        path: '/*',
        name: 'Notfound',
        component: () => import(/* webpackChunkName: "about" */ '../views/Notfound.vue')
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
