export default function Match(form, list, config) {
	// 将配置转换为对应的程序
	for (let field in config) {
		if (typeof config[field] === 'string') {
			config[field] = Match.methods[config[field]];
		}
	}
	// 开始过滤
	list.forEach(item => {
		item.isHide = false;
		let buf = [];
		for (let field in config) {
			buf.push(config[field](form[field], item[field]));
		}
		if (buf.indexOf(false) !== -1) {
			item.isHide = true;
		}
	});
}
Match.methods = {
	// 判断两个字符串是否相等
	// 商品所属店铺 shopId; 商品状态 status; 商品标准类目 categories; 商品属性 propsPid
	equal: (formVal, val) => {
		return formVal === null || String(formVal) === String(val);
	},
	// 大于等于某值
	// 价格、时间
	greaterEqual: (formVal, val) => {
		console.log('formVal:', formVal);
		console.log('val:', val);
		return formVal === null || Number(formVal) >= Number(val);
	},
	// 小于等于某值
	// 价格、时间
	lessEqual: (formVal, val) => {
		return formVal === null || Number(formVal) <= Number(val);
	},
	// 判断数组中是否存在某值
	// 商品 id
	equalArray: (formVal, val) => {
		return !formVal.length || formVal[0] === '' || formVal.indexOf(String(val)) !== -1;
	},
	// 模糊匹配字符串
	// 商品标题 name; 商品商家编码 outerId; SKU 商家编码 skusOuterId
	fuzzySearch: (formVal, val) => {
		return formVal === null || String(val).search(String(formVal)) !== -1;
	},
	// 模糊匹配数组
	// 商品自定义类目 shopCategories; 属性值 propsVid
	fuzzymutipleArray: (formVal, val) => {
		let isMatched = false;
		if (formVal.length) {
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
