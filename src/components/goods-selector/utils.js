import angular from 'angular';
import injector from 'angular-es-utils/injector';
import genResource from 'angular-es-utils/rs-generator';
import cloneDeep from 'lodash.clonedeep';

export const utils = {
	/**
	 * @param shopInfo Object 当前店铺
	 * @param selectedGoods Array 用户传进来的已选商品
	 * @param isSupportedSku bool 是否支持 sku
	 * @param serverName
	 * @returns {Promise<any>}
	 */
	transformGoodsData({shopId, plat, selectedGoods, serverName, isSupportedSku, apiPrefix}) {
		const ids = Object.keys(selectedGoods);
		const paramIdStr = ids.join('&id=');
		const shopIdStr = shopId.join('&shopId=');
		return new Promise((resolve, reject) => {
			genResource(`${serverName}${apiPrefix}/items?platform=${plat}&shopId=${shopIdStr}&id=${paramIdStr}`).save().$promise.then(res => {
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
	},

	getSkuName(sku) {
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
	},

	lightText(originText, keyWords) {
		originText = originText || '';
		let reg = new RegExp(keyWords, 'g');
		let result = '';
		if (keyWords && keyWords.length !== 0 && originText.indexOf(keyWords) > -1) {
			result = originText.toString().replace(reg, `<span class="highlight">${keyWords}</span>`);
		} else {
			result = originText.toString();
		}
		return injector.get('$sce').trustAsHtml(result);
	},

	getPrice(price) {
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
	},

	listCharacterIntercept(str, maxLength) {
		if (str.length > maxLength) {
			str = str.slice(0, maxLength) + '...';
		}
		return str;
	},

	// 用正则表达式实现html解码
	htmlDecodeByRegExp(str) {
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
	},

	isAllChildrenSelected(children) {
		return children && children.every(child => {
			return child.checked;
		});
	},

	isSomeChildrenSelected(children) {
		return children && !utils.isAllChildrenSelected(children) && children.some(child => {
			return child.checked || child.partial;
		});
	},

	isAllChildrenRemoved(children) {
		return !(utils.isAllChildrenSelected(children) || utils.isSomeChildrenSelected(children));
	},

	isAllChildrenHide(children) {
		return children && children.every(child => {
			return child.isHide;
		});
	},

	isAllChildrenExtend(children) {
		return children && children.every(child => {
			return child.extend;
		});
	},

	transformParams(queryCollection, formModel) {
		// 查询参数
		queryCollection['pageNum'] = 1;
		// 将部分参数属性名的驼峰转换成以 '.' 连接的形式
		for (let prop in formModel) {
			if (formModel.hasOwnProperty(prop)) {
				switch (prop) {
					case 'skusId':
						if (formModel[prop].length && !formModel[prop][0] && formModel[prop][0] !== 0) {
							formModel[prop] = [];
						}
						queryCollection['skus' + '.' + 'id'] = formModel[prop];
						break;
					case 'skusOuterId':
						queryCollection['skus' + '.' + 'outerId'] = formModel[prop];
						break;
					case 'skusPropsVname':
						queryCollection['skus' + '.' + 'props' + '.' + 'vname'] = formModel[prop];
						break;
					case 'categoriesId':
						queryCollection['categories' + '.' + 'id'] = formModel[prop];
						break;
					case 'shopCategoriesId':
						queryCollection['shopCategories' + '.' + 'id'] = formModel[prop];
						break;
					case 'propsPid':
						queryCollection['props' + '.' + 'pid'] = formModel[prop];
						break;
					case 'propsVid':
						queryCollection['props' + '.' + 'vid'] = formModel.propsVname ? null : formModel[prop];
						break;
					case 'propsVname':
						queryCollection['props' + '.' + 'vname'] = formModel[prop];
						break;
					case 'id':
						if (formModel[prop].length && !formModel[prop][0] && formModel[prop][0] !== 0) {
							formModel[prop] = [];
						}
						queryCollection[prop] = formModel[prop];
						break;
					case 'tagItemIds':
						delete queryCollection[prop]; // 后端搜索使用 POST 请求，将 tagItemIds 放到 request body 中
						break;
					case 'status':
						queryCollection[prop] = formModel[prop] === '-1' ? null : formModel[prop];
						break;
					default:
						queryCollection[prop] = formModel[prop];
				}
			}
		}
	},

	// 将参数对象转换成 & 符号连接的形式
	getStandardParams(params, exceptList = []) {
		let queryParams = cloneDeep(params);
		let paramsArr = [];
		for (let attr in queryParams) {
			if (queryParams.hasOwnProperty(attr) && (queryParams[attr] || queryParams[attr] === 0)) {
				let param = queryParams[attr];
				if (attr === 'status') {
					queryParams[attr] !== '-1' && paramsArr.push(`${attr}=${param}`);
				} else {
					if (!Array.isArray(param) && exceptList.indexOf(attr) === -1) {
						paramsArr.push(`${attr}=${param}`);
					}
					if (Array.isArray(param)) {
						param.forEach(item => {
							paramsArr.push(`${attr}=${item}`);
						});
					}
				}
			}
		}
		return paramsArr.join('&');
	},

	findEntityByName(collection, name) {
		return collection.findIndex(item => angular.equals(item.name, name));
	},

	// 处理表单项
	resolveFormModel(fieldsetConfigList, originFormModel, platform, isSupportedSku) {
		let formModel = {};
		for (let attr in originFormModel) {
			if (originFormModel.hasOwnProperty(attr)) {
				if (isSupportedSku) {
					if (utils.findEntityByName(fieldsetConfigList, attr) >= 0) {
						formModel[attr] = cloneDeep(originFormModel[attr]);
					}
				} else {
					if (utils.findEntityByName(fieldsetConfigList, attr) >= 0 && !fieldsetConfigList[utils.findEntityByName(fieldsetConfigList, attr)].isSkuItem) {
						formModel[attr] = cloneDeep(originFormModel[attr]);
					}
				}
			}
		}
		return formModel;
	}
};
