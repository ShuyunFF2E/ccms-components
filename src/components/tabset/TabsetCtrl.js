/**
 * @author fengqiu.wu
 */


import {Inject} from 'angular-es-utils';


@Inject('$element', '$attrs')
export default class TabsetCtrl {

	constructor($element, $attrs) {
		let vm = this;

		vm.small = $attrs.small === 'true';
		vm.remove = $attrs.removed === 'true';
		vm.justified = $attrs.justified === 'true';

		vm.active = !isNaN($attrs.active) ? $attrs.active : 0;

		vm.tabs.forEach((tab, index) => {
			tab.active && (vm.active = index);
		});

		if (vm.tabs[vm.active]) {
			vm.tabs[vm.active].active = true;
			vm.current = vm.tabs[vm.active];
		}
	}

	removeTab(tab) {
		// 找到需要删除的tab
		let removeIndex = this.tabs.indexOf(tab);

		this.tabs.splice(removeIndex, 1);

		if (tab.active && this.tabs.length) {
			this.tabs[0].active = true;
		}
	}

}
