import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios-auth';
import globalAxios from 'axios'

import router from './router'

import Tokens from './tokens'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  	idToken: null,
  	userId: null,
  	user: null
  },
  mutations: {
  	authUser (state, userData){
  		state.idToken = userData.token
  		state.userId = userData.userId
  	},
  	storeUser (state, user){
  		state.user = user
	  },
	clearAuthData(state){
		state.idToken = null
		state.userId = null
	}
  },
  actions: {
	setLogoutTimer ({dispatch},expirationTime){
		setTimeout(() => {
			dispatch('logout')
		},expirationTime * 1000 )
	},
  	signup({commit, dispatch}, authData){
  		axios.post('/signupNewUser?key='+ Tokens.token, 
          {email: authData.email, password: authData.password, returnSecureToken: true})
        .then(res =>{
        	console.log(res)
        	commit('authUser', {
        		token: res.data.idToken,
        		userId: res.data.localId
			})
			const now  = new Date()
			const exporationDate = new Date ( now.getTime() + res.data.expiresIn * 1000)
			localStorage.setItem('token', res.data.idToken)
			localStorage.setItem('expirationDate', exporationDate)
			localStorage.setItem('userId',res.data.localId)
			dispatch('storeUser', authData)
			dispatch('setLogoutTimer', res.data.expiresIn)
        })
        .catch(error=> console.log(error))

  	},
  	login({commit, dispatch}, authData){
  		axios.post('/verifyPassword?key='+ Tokens.token, 
        {email: authData.email, password: authData.password, returnSecureToken: true})
      .then(res =>{
        	console.log(res)
        	commit('authUser', {
        		token: res.data.idToken,
        		userId: res.data.localId
			})
			const now  = new Date()
			const exporationDate = new Date ( now.getTime() + res.data.expiresIn * 1000)
			localStorage.setItem('token', res.data.idToken)
			localStorage.setItem('expirationDate', exporationDate)
			localStorage.setItem('userId',res.data.localId)
			dispatch('setLogoutTimer', res.data.expiresIn)
        })
      .catch(error=> console.log(error))
  	},
  	storeUser ({commit, state}, userData){
  		if(!state.idToken){ // valida q este con un token
  			return
  		}
  		globalAxios.post('/users.json' + '?auth=' + state.idToken, userData)
  		.then(res => console.log(res))
  		.catch(error => console.log(error))
  	},
  	fetchUser({commit, state}){
  		if(!state.idToken){ // valida q este con un token
  			return
  		}
  		 globalAxios.get('/users.json'+ '?auth='+ state.idToken)
        .then(res => {console.log(res)
              const data = res.data
              this.users =res.data
              const users = []
              for (let key in data) {
                const user = data[key]
                user.id = key
                users.push(user);
              }
              console.log(users)
              commit('storeUser', users[0])
              this.email = users[0].email
            })
        .catch(error =>console.log(error))
	  },
	  logout({commit}){
		  commit('clearAuthData')
		  router.replace('/signin')
		  localStorage.removeItem('expirationDate')
		  localStorage.removeItem('token')
		  localStorage.removeItem('userId')
	  },
	  tryAutoLogin({commit}){
		  const token = localStorage.getItem('token')
		  if(!token){
			  return
		  }
		  const expirationDate = localStorage.getItem('expirationDate')
		  const now = new Date()
		  if (now >= expirationDate){
			  return
		  }
		  const userId = localStorage.getItem('userId')
		  commit('authUser',{
			  tokem: token,
			  userId: userId
		  })

		  
	  }
  },
  getters: {
  	user(state){
  		return state.user
	  },
	isAuthenticated(state){
		return state.idToken !== null
	}
  }
})