export function toString(args) {
	return Object.prototype.toString.call(args);
}

export function isNumeric(n) {
	return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}

export function isNumber(n) {
	return typeof n === 'number';
}

export function isString(s) {
	return typeof s === 'string';
}

export function isFunction(fn) {
	return typeof fn === 'function';
}

export function isArray(arr) {
	return Array.isArray(arr);
}

export function isObject(obj) {
	return obj && typeof obj === 'object';
}

export function isUndef(n) {
	return n === undefined || n === null;
}

export function isDef(n) {
	return n !== undefined && n !== null;
}

export function dateFormat(date, fmt = 'yyyy-mm-dd hh:ii:ss') {
	date = new Date(date);

	let ret;
	const opt = {
		'y+': date.getFullYear().toString(),
		'm+': (date.getMonth() + 1).toString(),
		'd+': date.getDate().toString(),
		'h+': date.getHours().toString(),
		'i+': date.getMinutes().toString(),
		's+': date.getSeconds().toString(),
	};

	for (let k in opt) {
		ret = new RegExp('(' + k + ')').exec(fmt);
		if (ret) {
			fmt = fmt.replace(
				ret[1],
				ret[1].length == 1
					? opt[k]
					: opt[k].padStart(ret[1].length, '0')
			);
		}
	}

	return fmt;
}

export function getObjectURL(file) {
	let url = null;
	if (window.createObjectURL != undefined) {
		// basic
		url = window.createObjectURL(file);
	} else if (window.URL != undefined) {
		// mozilla(firefox)
		url = window.URL.createObjectURL(file);
	} else if (window.webkitURL != undefined) {
		// webkit or chrome
		url = window.webkitURL.createObjectURL(file);
	}
	return url;
}

export function getPictureBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
}
