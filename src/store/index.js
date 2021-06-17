import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authenticated: localStorage.getItem('auth') ? true : false,
    mode: JSON.parse(localStorage.getItem('mode')),
    role: localStorage.getItem('role')  || 'null',
    user: {},
    patientsSearch:[],
    workingStartTime: localStorage.getItem('workingStartTime'),
    workingEndTime: localStorage.getItem('workingEndTime'),
    agendaView:localStorage.getItem('agendaView'),
    navBarTitle: 'Dashboard',
    // localhost: 'http://192.168.1.10:8000',
    localhost: 'http://localhost:8000',

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
      },
      setPatientsSearch : (state,payload) =>{
          state.patientsSearch = payload
      },
      setNavBarTitle(state, payload){
          state.navBarTitle = payload
      },
      setMode(state, payload){
          state.mode =  payload
      },
      setworkingStartTime(state, payload){
          state.workingStartTime =  payload
      },
      setworkingEndTime(state, payload){
          state.workingEndTime =  payload
      },
      setagendaView(state, payload){
          state.agendaView =  payload
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
          localStorage.removeItem('auth')
          localStorage.removeItem('role')
          localStorage.removeItem('token')
          context.commit('authenticate' , false)
          context.commit('setRole' , null)
          context.commit('setUser' , {})
          Vue.axios.post('/logout').then(res => {
              console.log('logout request')
              console.log(res)



          }).catch((err) => {
              console.log('logout error')
              console.log(err)
          })
          if (!(router.currentRoute.name == 'login')){
              router.push({name : 'login'})
          }
      },
      searchPatient(context,query){
          return new Promise(function (resolve, reject) {
              Vue.axios.get(`/patients?q=${query}`)
                  .then(res => {

                      context.commit('setPatientsSearch' , res)
                      resolve(res)
                  })
                  .catch (err => {
                      console.log(err)
                      reject(err)
                  })
          })
      },
  },
  modules: {
  },

})
