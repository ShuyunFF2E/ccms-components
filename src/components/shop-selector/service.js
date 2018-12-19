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
	getAreaData(serverName, areaUrl) {
		let url = areaUrl || `${ serverName }/shuyun-searchapi/1.0/area?platform=unification`;
		return genResource(url, null, null, {
			get: {
				method: 'GET',
				isArray: true
			}
		});
	},

	// 获取店铺列表
	getShopList(serverName, tenantId, params, paramsName) {
		return genResource(`${ serverName }${ apiPrefix }/shopDetails?tenantId=${tenantId}&${transformParams(params, paramsName)}`);
	},

	// 获取所有店铺
	getShopListAll({ serverName, tenantId, queryParams, formModel }) {
		const paramsArr = [];
		for (const attr in formModel) {
			if (formModel.hasOwnProperty(attr) && queryParams.hasOwnProperty(attr)) {
				const paramVal = queryParams[attr];
				if (paramVal && !Array.isArray(paramVal)) {
					paramsArr.push(`${attr}=${paramVal}`);
				}
				if (Array.isArray(paramVal) && paramVal.length) {
					paramVal.forEach(item => {
						paramsArr.push(`${attr}=${item}`);
					});
				}
			}
		}
		const paramsStr = paramsArr.length ? `&${paramsArr.join('&')}` : '';
		return genResource(`${ serverName }${ apiPrefix }/shopDetails?tenantId=${tenantId}${paramsStr}`);
	}
};
