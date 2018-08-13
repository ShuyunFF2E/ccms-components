export default {
	match(form, list, config) {
		if (!list) {
			list = [];
		}
		let methods = this.getMethods();
		// 将配置转换为对应的程序
		for (let field in config) {
			if (typeof config[field] === 'string') {
				config[field] = methods[config[field]];
			}
		}
		// 开始过滤
		list.forEach(entity => {
			let buf = [];
			for (let field in config) {
				buf.push(config[field](form[field], entity[field]));
			}
			if (buf.indexOf(false) !== -1) {
				entity.isHide = true;
			}
		});
		return list;
	},
	getMethods() {
		return {
			// 判断两个字符串是否相等
			// 渠道 channel; 店铺类型 type
			equal: (formVal, val) => {
				return !formVal && formVal !== 0 || String(formVal).replace(/\s/g, '') === String(val);
			},
			// 模糊匹配字符串
			// 店铺名称和店铺ID sign
			fuzzySearch: (formVal, val) => {
				return !formVal && formVal !== 0 || String(val).replace(/\s/g, '').search(String(formVal)) !== -1;
			}
		};
	}
};
