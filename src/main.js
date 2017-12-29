import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'
import axios from 'axios'

axios.defaults.baseURL = 'https://auth-vue-axios.firebaseio.com';
/*axios.defaults.headers.common['Authorization'] = 'asd'*/

/*Interseptors */
const reqInterceptor = axios.interceptors.request.use(config => {
	console.log("config request",config)
	/*config.headers.*/
	return config;
});

const resInterceptor = axios.interceptors.response.use(res => {
	console.log('response res ', res)
	return res
})

axios.interceptors.request.eject(reqInterceptor)
axios.interceptors.response.eject(resInterceptor)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
