import genResource from 'angular-es-utils/rs-generator';
import { apiPrefix } from './Constant';

// 参数转换
function transformParams(params, paramsName) {
	let arr = [];
	if (Array.isArray(params) && paramsName) {
		params.forEach(item => {
			arr.push(`${paramsName}=${item}`);
		});
	}
	if (Object.prototype.toString.call(params) === '[object Object]') {
		for (let attr in params) {
			if (params.hasOwnProperty(attr)) {
				arr.push(`${attr}=${params[attr]}`);
			}
		}
	}
	return arr.join('&');
}

export default {
	// 获取渠道列表
	getChannelList(serverName) {
		return genResource(`${ serverName }${ apiPrefix }/channel`, null, null, {
			get: {
				method: 'GET',
				isArray: true
			}
		});
	},

	// 获取地区列表
	getAreaData(serverName, platform) {
		return genResource(`${ serverName }${ apiPrefix }/shopArea?platform=${ platform }`, null, null, {
			get: {
				method: 'GET',
				isArray: true
			}
		});
	},

	// 获取店铺列表
	getShopList(serverName, params, paramsName) {
		return genResource(`${ serverName }${ apiPrefix }/shopDetails?${transformParams(params, paramsName)}`);
	}
};
