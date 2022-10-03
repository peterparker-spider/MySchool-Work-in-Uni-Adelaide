import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		isLoginSuccess: false,
		userInfo: {
			id: null,
			email: '',
			firstname: '',
			image: '',
			is_manager: null,
			lastname: '',
			username: '',
		},
	},
	mutations: {
		setLoginStatus(state, data) {
			state.isLoginSuccess = data;
		},
		setUserInfo(state, data) {
			state.userInfo = Object.assign(state.userInfo, data);
		},
	},
});
