/**
 * Created with MenusNodeCtrl.js
 * @Description:
 * @Author: muchaoyang
 * @Date: 2016-03-16 9:04 AM
 * To change this template use File | Settings | File Templates.
 */
import {Inject} from 'angular-es-utils';

@Inject('$state', '$timeout')
export default class MenusNodeCtrl {

	constructor($state, $timeout) {

		$timeout(() => {
			this.$state = $state;
		}, 0);
	}

	/**
	 * 点击菜单
	 * @param node
	 */
	clickParents(node) {
		node.toggleNode = !node.toggleNode;
	};
}
