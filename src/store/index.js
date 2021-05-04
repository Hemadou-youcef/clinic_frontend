import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authenticated: localStorage.getItem('auth') ? true : false,
    role: localStorage.getItem('role')  || 'null',
    user: {},


  },
  getters: {

  },
  mutations: {
      authenticate: (state , status) => {
        state.authenticated = status
      },
      setRole : (state, payload) => {
        state.role = payload
      },
      setUser:(state, payload) => {
          state.user = payload
      }
  },
  actions: {
      getUser(context){
          Vue.axios.post('/user').then(
              res => {
                  console.log(res)
                  context.commit('setUser' , res.data)
              }
          )
      },
      logout(context) {
          Vue.axios.post('/logout').then(res => {
              console.log('logout request')
              console.log(res)
              localStorage.removeItem('auth')
              localStorage.removeItem('role')
              context.commit('authenticate' , false)
              context.commit('setRole' , null)
              context.commit('setUser' , {})
              if (!(router.currentRoute.name == 'login')){
                  router.push({name : 'login'})
              }

          }).catch((err) => {
              console.log('logout error')
              console.log(err)
          })
      },
  },
  modules: {
  },

})
