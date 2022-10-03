import { get, post, put, del, postFormData } from './service';

export function getUserManage_api(data) {
	return get(`/users/user_manage`, data);
}

export function getEventManage_api(data) {
	return get(`/`, data)
}

export function getUsers_api(data) {
	return get(`/users`, data);
}

export function getEvents_api(data) {
	return get(`/`, data);
}

export function getEventDetail_api(data) {
	return get(`/events/${data.id}`, data);
}

export function postNewEvents_api(data) {
	return post(`/events`, data);
}

export function postEventUsers_api(data) {
	return post(`/events/${data.id}/users`, data);
}

export function postUserInfos_api(data) {
	return post(`/users/user_information`, data);
}
