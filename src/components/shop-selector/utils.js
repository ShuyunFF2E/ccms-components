export default {
	match(form, list) {
		if (!list) {
			list = [];
		}
		let methods = this.getMethods();
		// 开始过滤
		list.forEach(entity => {
			let buf = [];
			for (let field in form) {
				if (field === 'channel' || field === 'type') {
					buf.push(methods.equal(form[field], entity[field]));
				} else if (field === 'sign') {
					const group = ['name', 'id'];
					buf.push(methods.fuzzySearchGroup(group, form[field], entity));
				} else if (field === 'province') {
					let provinceName = form['provinceName'] ? form['provinceName'] : '',
						cityName = form['cityName'] ? form['cityName'] : '',
						districtName = form['districtName'] ? form['districtName'] : '',
						formVal = `${provinceName}${cityName}${districtName}`;
					buf.push(methods.fuzzySearch(formVal, entity.address));
				}
			}
			entity.isHide = buf.indexOf(false) !== -1;
		});
	},
	getMethods() {
		return {
			// 判断两个字符串是否相等
			// 渠道 channel; 店铺类型 type
			equal: (formVal, val) => {
				return !formVal && formVal !== 0 || String(formVal).replace(/\s/g, '') === String(val);
			},
			// 返回多个条件过滤后的并集
			fuzzySearchGroup: (group, formVal, entity) => {
				let buf = [];
				group.forEach(item => {
					buf.push(!formVal && formVal !== 0 || String(entity[item]).replace(/\s/g, '').search(String(formVal)) !== -1);
				});
				return buf.indexOf(true) !== -1;
			},
			// 模糊匹配字符串
			fuzzySearch: (formVal, val) => {
				return !formVal && formVal !== 0 || String(val).replace(/\s/g, '').search(String(formVal)) !== -1;
			}
		};
	}
};
