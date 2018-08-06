import injector from 'angular-es-utils/injector';
import genResource from 'angular-es-utils/rs-generator';
import { apiPrefix } from './constant';

/**
 * @param shopInfo Object 当前店铺
 * @param selectedGoods Array 用户传进来的已选商品
 * @param serverName
 * @param isSupportedSku bool 是否支持 sku
 * @returns {Promise<any>}
 */
export function transformGoodsData({shopInfo, selectedGoods, serverName, isSupportedSku}) {

	const platform = shopInfo.plat;
	const shopId = shopInfo.shopId;
	const ids = Object.keys(selectedGoods);
	const paramIdStr = ids.join('&id=');
	return new Promise((resolve, reject) => {
		genResource(`${serverName}${apiPrefix}/items?platform=${platform}&shopId=${shopId}&id=${paramIdStr}`).save().$promise.then(res => {
			res['data'] = res['data'] || [];
			let transformedData = res.data.map(d => {
				if (isSupportedSku) {
					d.skus && d.skus.forEach(sku => {
						if (selectedGoods[d.id] === null) {
							sku.checked = true;
						} else if (selectedGoods[d.id].includes(sku.id)) {
							sku.checked = true;
						}
					});
				} else {
					if (d.skus) {
						delete d.skus;
					}
				}

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
export const getSkuName = sku => {
	let propName = '';
	if (sku.props && sku.props.length) {
		for (let i = 0; i < sku.props.length; i++) {
			if (i === sku.props.length - 1) {
				if (sku.props[i].pname) {
					propName += sku.props[i].pname + '：' + sku.props[i].vname;
				} else {
					propName += sku.props[i].vname;
				}
			} else {
				if (sku.props[i].pname) {
					propName += sku.props[i].pname + '：' + sku.props[i].vname + '；';
				} else {
					propName += sku.props[i].vname + '；';
				}
			}
		}
	}
	return propName;
};

export const lightText = (originText, keyWords) => {
	originText = originText || '';
	let reg = new RegExp(keyWords, 'g');
	let result = '';
	if (keyWords && keyWords.length !== 0 && originText.indexOf(keyWords) > -1) {
		result = originText.toString().replace(reg, `<span class="highlight">${keyWords}</span>`);
	} else {
		result = originText.toString();
	}
	return injector.get('$sce').trustAsHtml(result);
};

export const getPrice = price => {
	let buffer = [];
	if (price || price === 0) {
		buffer = String(price).split('.');
	}
	if (buffer.length === 2) {
		buffer[0] = buffer[0].replace(/(?=(?!\b)(\d{3})+$)/g, ',');
		if (buffer[1].length === 1) {
			price = buffer[0] + '.' + buffer[1] + '0';
		} else if (buffer[1].length === 2) {
			price = buffer[0] + '.' + buffer[1];
		} else {
			price = buffer[0] + '.' + buffer[1].slice(0, 2);
		}
	} else {
		price = String(price).replace(/(?=(?!\b)(\d{3})+$)/g, ',');
		price += '.00';
	}
	return '￥' + price;
};

export const listCharacterIntercept = (str, maxLength) => {
	if (str.length > maxLength) {
		str = str.slice(0, maxLength) + '...';
	}
	return str;
};

// 用正则表达式实现html解码
export const htmlDecodeByRegExp = str => {
	let s = '';
	if (str.length === 0) {
		return '';
	}
	s = str.replace(/&amp;/g, '&');
	s = s.replace(/&lt;/g, '<');
	s = s.replace(/&gt;/g, '>');
	s = s.replace(/&nbsp;/g, ' ');
	s = s.replace(/&#39;/g, '\'');
	s = s.replace(/&quot;/g, '\"');
	return s;
};
