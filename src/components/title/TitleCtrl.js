/**
 * Created with TitleCtrl.js
 * @Description:
 * @Author: muchaoyang
 * @Date: 2016-06-01 10:49 AM
 * To change this template use File | Settings | File Templates.
 */
import {EventBus} from 'angular-es-utils';
let eventBus;
export default class TitleCtrl {
	constructor() {
		const self = this;

		// 如果未配置name 则获取菜单数据
		if (!self.name) {

			// -检测菜单选中
			eventBus = EventBus.on('menuSelect', menu => {
				self.name = self.name || menu.name;
			});
		}
	}

	$onDestroy() {
		eventBus && eventBus();
	}
}
