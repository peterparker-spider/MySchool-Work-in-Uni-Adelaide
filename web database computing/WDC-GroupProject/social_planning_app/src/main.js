import Vue from 'vue';
import router from '@/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';
import App from './App.vue';
import store from '@/store';

Vue.config.productionTip = false;

new Vue({
	store,
	router,
	render: (h) => h(App),
}).$mount('#app');
