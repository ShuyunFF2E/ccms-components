/**
 * Created with ShopSelectsFilter.js
 * @Description:
 * @Author: muchaoyang
 * @Date: 2016-04-14 8:14 PM
 * To change this template use File | Settings | File Templates.
 */
/**
 * 根据name模糊查询店铺列表
 * @returns {Function}
 * @constructor
 */
export function SearchShop() {
	return (list, name) => {
		let delIndex = [];
		if (name) {
			Array.isArray(list) && list.forEach((plats, index) => {
				plats.result = [];
				Array.isArray(plats.child) && plats.child.forEach(shop => {
					if (shop.name.includes(name)) {
						plats.result.push(shop);
					}
				});
				if (plats.result.length === 0) {
					delIndex.push(plats);
				} else {
					plats.child = plats.result;
					delete plats.result;
				}
			});

			// -删除多余的项
			delIndex.forEach(plat => {
				list.splice(list.indexOf(plat), 1);
			});
		}
		return list;
	};
}
