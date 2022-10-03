import { del, post } from './service';

export function getAuthToken() {
	let userInfo = JSON.parse(localStorage.getItem('user_info'));

	if (userInfo) {
		return userInfo;
	}
	return null;
}

export function isLoginSuccess() {
	let token = getAuthToken();
	return token != '' && token != null;
}

export function getLoginAuth() {
	return new Promise((resolve) => {
		let token = getAuthToken();
		resolve(token);
	});
}

export function postLogin_api(data) {
	return post('/users/login', data);
}

export function delLogout_api(params) {
	return del('/users/logout', params);
}

export function postRegister_api(data) {
	return post('/users/register', data);
}
