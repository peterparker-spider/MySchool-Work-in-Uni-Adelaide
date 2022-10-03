import axios from 'axios';
import { isUndef } from '../utils/util';
import router from '../router';
import store from '../store';

const HTTP_CODE_MAP = {
	302: 'Redirection',
	400: 'Request error',
	401: 'Not authorized, please log in',
	403: 'Forbidden',
	404: 'Error requesting address',
	408: 'Request timed out',
	500: 'Server internal error',
	501: 'Service not implemented',
	502: 'Gateway error',
	503: 'Service unavailable',
	504: 'Gateway timeout',
	505: 'HTTP version is not supported',
};

const baseUrl = 'http://127.0.0.1:3000';

function goLogin() {
	router.push({
		path: '/login',
		query: {
			redirect: router.currentRoute.fullPath,
		},
	});
}

axios.defaults.withCredentials = true;

export const service = axios.create({
	baseURL: baseUrl,
	timeout: 30 * 1000,
	headers: {
		// 'Content-Type': 'application/x-www-form-urlencoded',
		// 'Content-Type': 'application/json',
		Accept: 'application/json',
	},
});

service.interceptors.request.use((config) => {
	return config;
}, errorHandler);

service.interceptors.response.use((response) => {
	// console.log('response---', response);
	const { data } = response;
	const { code } = data;
	if (code == 401) {
		store.commit('setLoginStatus', false);
		localStorage.setItem('user_info', null);
		goLogin();
		return;
	}

	if (isUndef(code)) {
		return data;
	}

	if (code == 0 || code == 1) {
		return data;
	}

	return Promise.reject(response);
}, errorHandler);

function errorHandler(error) {
	console.log('error---', error, error.message, error.response);
	if (error.message && error.message.includes('Network Error')) {
		alert(error.message);
		return;
	}

	const status = error.response.status;

	let message;
	if (status) {
		let data = error.response.data;
		if (status == 401) {
			if (data.message) {
				alert(data.message);
			}

			store.commit('setLoginStatus', false);
			localStorage.setItem('user_info', null);
			goLogin();
		} else if (status == 400 || status == 426 || status == 403) {
			alert(data.message);
		} else if (status == 500) {
			if (data.message) {
				message = data.message;
			} else {
				message = HTTP_CODE_MAP[status];
			}
			alert(message);
		} else {
			message = HTTP_CODE_MAP[status] || 'Data request failed!';
			alert(message);
		}
	}

	return Promise.reject(error);
}

export function postFormData(url, formData) {
	return new Promise((resolve, reject) => {
		axios({
			url: baseUrl + url,
			method: 'post',
			data: formData,
			processData: false,
			contentType: false,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
			.then((res) => {
				if (res.status === 401) {
					goLogin();
				}
				if (res.status === 200) {
					resolve(res);
				}
			})
			.catch((err) => {
				console.log('postFormData error---response', err.response);
				const status = err.response.status;
				if (status) {
					let data = err.response.data;
					if (status == 401) {
						goLogin();
					}
					if (status == 426 || status == 500) {
						alert(data.message);
					}
				}

				reject(err);
			});
	});
}

export function get(url, params) {
	return service({
		method: 'get',
		url,
		params,
	});
}

export function del(url, data) {
	return service({
		method: 'delete',
		url,
		data,
	});
}

export function post(url, data) {
	return service({
		method: 'post',
		url,
		data,
	});
}

export function put(url, data) {
	return service({
		method: 'put',
		url,
		data,
	});
}
