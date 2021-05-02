import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authenticated: localStorage.getItem('auth') ? true : false,
    role: localStorage.getItem('role')  || 'guest',
      user: {}

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
  },
  modules: {
  },

})
