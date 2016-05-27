/**
 * @author fengqiu.wu
 */


import {Inject} from 'angular-es-utils';


@Inject('$scope', '$element', '$attrs')
export default class TabsetCtrl {

	constructor($scope, $element, $attrs) {
		let vm = this;

		vm.tabs = vm.tabs || [];
		vm.small = $attrs.small === 'true';
		vm.remove = $attrs.removed === 'true';
		vm.justified = $attrs.justified === 'true';

		vm.active = !isNaN($attrs.active) ? $attrs.active : 0;

		let unwatch = $scope.$watch('tabs', () => {
			vm.tabs.forEach((tab, index) => {
				tab.active && (vm.active = index);
			});

			if (vm.tabs[vm.active]) {
				vm.tabs[vm.active].active = true;
				vm.current = vm.tabs[vm.active];
			}
			unwatch();
		});
	}

	removeTab(tab) {
		// 找到需要删除的tab
		let removeIndex = this.tabs.indexOf(tab);
		let prevIndex = removeIndex - 1;

		this.tabs.splice(removeIndex, 1);

		if (tab.active && this.tabs[prevIndex]) {
			if (!this.tabs[prevIndex].disabled) {
				this.tabs[prevIndex].active = true;
			} else if (prevIndex >= 0) {
				for (let i = prevIndex; i >= 0; i--) {
					if (!this.tabs[i].disabled) {
						this.tabs[i].active = true;
						break;
					}
				}
			} else {
				this.tabs[0].active = true;
			}
		}
	}

}
