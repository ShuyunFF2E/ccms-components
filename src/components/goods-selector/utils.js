import genResource from 'angular-es-utils/rs-generator';
import { apiPrefix } from './constant';

export function transformGoodsData(shopInfo, selectedGoodIds) {

	if (Array.isArray(shopInfo)) {
		shopInfo = shopInfo[0];
	}

	const ids = Object.keys(selectedGoodIds);
	return new Promise((resolve, reject) => {
		genResource(`${apiPrefix}/items?platform=${shopInfo.plat}&shopId=${shopInfo.shopId}&id=${ids}`, false, null).get().$promise.then(res => {
			// 数据转换
			let transformedData = res.data.map(d => {
				d.skus.forEach(sku => {
					if (selectedGoodIds[d.id] && selectedGoodIds[d.id].includes(sku.id)) {
						sku.checked = true;
					}
				});

				d.partial = d.skus.some(s => s.checked === true);
				d.checked = d.skus.every(s => s.checked === true);

				return d;
			});

			resolve(transformedData);
		}).catch(err => {
			reject(err);
		});
	});
}
