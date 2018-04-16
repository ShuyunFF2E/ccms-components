import genResource from 'angular-es-utils/rs-generator';
import { apiPrefix } from './constant';

export function transformGoodsData(shopInfo, selectedGoodIds, serverName) {

	if (Array.isArray(shopInfo)) {
		shopInfo = shopInfo[0];
	}

	const ids = Object.keys(selectedGoodIds);
	const paramIdStr = ids.join('&id=');
	return new Promise((resolve, reject) => {
		genResource(`${serverName}${apiPrefix}/items?platform=${shopInfo.plat}&shopId=${shopInfo.shopId}&id=${paramIdStr}`, false, null).get().$promise.then(res => {
			// 数据转换
			if (!res['data']) {
				res['data'] = [];
			}
			let transformedData = res.data.map(d => {
				d.skus.forEach(sku => {
					if (selectedGoodIds[d.id] === null) {
						sku.checked = true;
					} else if (selectedGoodIds[d.id].includes(sku.id)) {
						sku.checked = true;
					}
				});

				d.partial = d.skus ? !d.skus.every(s => s.checked === true) && d.skus.some(s => s.checked === true) : false;
				d.checked = d.skus ? d.skus.every(s => s.checked === true) : true;

				return d;
			});

			resolve(transformedData);
		}).catch(err => {
			reject(err);
		});
	});
}
