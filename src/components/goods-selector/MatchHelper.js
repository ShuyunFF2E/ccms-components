export default {
	match(form, list, config) {
		if (!list) {
			list = [];
		}
		let methods = this.getMethods();
		// 将配置转换为对应的程序
		for (let field in config) {
			if (config.hasOwnProperty(field) && typeof config[field] === 'string') {
				config[field] = methods[config[field]];
			}
		}
		// 开始过滤
		list.forEach(item => {
			let buf = [];
			for (let field in config) {
				if (config.hasOwnProperty(field)) {
					buf.push(config[field](form[field], item[field]));
				}
			}
			if (buf.indexOf(false) !== -1) {
				item.isHide = true;
			}
		});
	},
	getMethods() {
		return {
			// 判断两个字符串是否相等
			// 商品标准类目 categories; 商品属性 propsPid
			equal: (formVal, val) => {
				return !formVal && formVal !== 0 || String(formVal).replace(/\s/g, '') === String(val);
			},
			// 商品所属店铺 shopId;
			equalStr: (formVal, val) => {
				if (Array.isArray(formVal)) {
					return formVal.indexOf(String(val)) !== -1;
				} else {
					return String(formVal).replace(/\s/g, '') === String(val);
				}
			},
			// 商品状态 status;
			equalStatus: (formVal, val) => {
				return !formVal && formVal !== 0 || formVal === val;
			},
			// 大于等于某值
			// 价格、时间
			greaterEqual: (formVal, val) => {
				return !formVal && formVal !== 0 || Number(formVal) >= Number(val);
			},
			// 小于等于某值
			// 价格、时间
			lessEqual: (formVal, val) => {
				return !formVal && formVal !== 0 || Number(formVal) <= Number(val);
			},
			// 判断数组中是否存在某值
			// 商品 id
			equalArray: (formVal, val) => {
				return !formVal || !formVal.length || !formVal[0] && formVal[0] !== 0 || formVal.indexOf(String(val)) !== -1;
			},
			// 模糊匹配字符串
			// 商品标题 name; 商品商家编码 outerId; SKU 商家编码 skusOuterId
			fuzzySearch: (formVal, val) => {
				return !formVal && formVal !== 0 || String(val).replace(/\s/g, '').search(String(formVal)) !== -1;
			},
			// 模糊匹配数组
			// 商品自定义类目 shopCategories; 属性值 propsVid
			fuzzymutipleArray: (formVal, val) => {
				let isMatched = false;
				if (formVal && formVal.length) {
					for (let i = 0; i < formVal.length; i++) {
						if (val.indexOf(formVal[i]) !== -1) {
							isMatched = true;
							break;
						}
					}
				} else {
					isMatched = true;
				}
				return isMatched;
			}
		};
	},
	// 商品标签前端筛选
	goodsLabelSearch(selectedItems, selectedLabels) {
		if (selectedLabels.length && selectedItems.length) {
			let ids = [];
			selectedLabels.forEach(item => {
				let items = item.itemIds;
				if (items && items.length) {
					ids.push(...items);
				}
			});
			let labelIds = this.removeArrayDuplicate(ids);
			selectedItems.forEach(item => {
				if (labelIds.indexOf(item.id) === -1) {
					item.isHide = true;
				}
			});
		}
	},

	// 数组去重
	removeArrayDuplicate(array) {
		let obj = {};
		let result = [];
		if (array.length) {
			array.forEach(item => {
				obj[item] = null;
			});
		}
		for (let attr in obj) {
			if (obj.hasOwnProperty(attr)) {
				result.push(attr);
			}
		}
		return result;
	},

	// 获取所有搜索条件组成的字符串
	getFormCondition(config) {
		let methods = this.getConditionFilterMethods();
		let result = [];
		for (let attr in config) {
			if (config.hasOwnProperty(attr)) {
				let item = config[attr];
				let itemResult = methods[item.method](item.params);
				if (itemResult) {
					result.push(itemResult);
				}
			}
		}
		return result.join(';');
	},

	getConditionFilterMethods() {
		return {
			/**
			 * 根据 value(单值) 查询 title 值
			 * @param dataList 查询数组
			 * @param valueName 待查询的 value 在 dataList 中对应的键名
			 * @param value 待查询的 value
			 * @param titleName 待查询的 value 对应的 title 在 dataList 中对应的键名
			 * @param title 待查询的 value 对应的 title 的名称
			 */
			queryTitleByValue({dataList, valueName, value, titleName, title}) {
				dataList = dataList || [];
				let result = null;
				dataList.forEach(item => {
					if (item[valueName] === value && (value || value === 0)) {
						result = item[titleName];
					}
				});
				return result ? title + '=' + result : '';
			},

			queryTitleByValueStr({dataList, valueName, value, titleName, title}) {
				if (Array.isArray(value)) {
					return this.queryTitleByValueArray({dataList, valueName, value, titleName, title});
				} else {
					return this.queryTitleByValue({dataList, valueName, value, titleName, title});
				}
			},

			queryTitleByValueArray({dataList, valueName, value, titleName, title}) {
				dataList = dataList || [];
				let result = [];
				dataList.forEach(item => {
					value.forEach(val => {
						if (item[valueName] === val) {
							result.push(item[titleName]);
						}
					});
				});
				return result.length ? title + '=' + result.join(',') : '';
			},

			/**
			 * 根据 title 的键名获取 title 的值
			 * @param dataList
			 * @param titleName
			 * @param title
			 * @returns {string}
			 */
			queryTitleByArray({dataList, titleName, title}) {
				dataList = dataList || [];
				let result = dataList.map(item => {
					return item[titleName];
				});
				return result.length ? title + '=' + result.join(',') : '';
			},

			// 根据时间戳获取标准格式时间
			timestampToTime(timestamp) {
				if (timestamp) {
					let date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
					let Y = date.getFullYear() + '-';
					let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
					let D = date.getDate() + ' ';
					return Y + M + D;
				} else {
					return '';
				}
			},

			getListTime({time, title}) {
				let startListTime = this.timestampToTime(time);
				return startListTime ? title + ':' + startListTime : '';
			},

			getValue({value, title}) {
				if (Array.isArray(value)) {
					return value.length > 1 || value.length === 1 && value[0] !== '' ? title + '=' + value.join(',') : '';
				} else {
					return (value || value === 0) ? title + '=' + value : '';
				}
			}
		};
	}
};
