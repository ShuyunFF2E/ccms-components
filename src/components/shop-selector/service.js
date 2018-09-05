import genResource from 'angular-es-utils/rs-generator';
import { apiPrefix } from './Constant';

// 参数转换
function transformParams(params, paramsName) {
	let str = `${paramsName}=`;
	if (Array.isArray(params)) {
		str += params.join(',');
	}
	return str;
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
	getAreaData(serverName) {
		return genResource(`${ serverName }/shuyun-searchapi/1.0/area?platform=top`, null, null, {
			get: {
				method: 'GET',
				isArray: true
			}
		});
	},

	// 获取店铺列表
	getShopList(serverName, tenantId, params, paramsName) {
		return genResource(`${ serverName }${ apiPrefix }/shopDetails?tenantId=${tenantId}&${transformParams(params, paramsName)}`);
	}
};
