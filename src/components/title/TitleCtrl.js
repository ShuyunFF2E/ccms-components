/**
 * Created with TitleCtrl.js
 * @Description:
 * @Author: muchaoyang
 * @Date: 2016-06-01 10:49 AM
 * To change this template use File | Settings | File Templates.
 */
import {EventBus} from 'angular-es-utils';

export default class TitleCtrl {
	constructor() {
		const self = this;
		/**
		 * 检测菜单选中
		 */
		EventBus.on('menuSelect', menu => {
			self.name = self.name || menu.name;
		});
	}
}
