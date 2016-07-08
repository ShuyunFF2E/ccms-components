/**
 * Created with TitleCtrl.js
 * @Description:
 * @Author: muchaoyang
 * @Date: 2016-06-01 10:49 AM
 * To change this template use File | Settings | File Templates.
 */
import {EventBus} from 'angular-es-utils';

export default class TitleCtrl {

	$onInit() {
		!this.name && (this.eventBus = EventBus.on('menu:change', menu => {
			this.name = menu.name;
		}));
	}

	$onDestroy() {
		this.eventBus && this.eventBus();
	}
}
