/**
 * @author fengqiu.wu
 */

import {Inject} from 'angular-es-utils';

@Inject()
export default class TabsetCtrl {

	$onInit() {
		let activeIndex = (this.active || 1) - 1;

		this.tabs = this.tabs || [];

		if (activeIndex >= this.tabs.length - 1) {
			activeIndex = this.tabs.length - 1;
		}

		this.current = this.tabs[activeIndex];
		this.current.active = true;
	}

	selectTab(tab, anyValue) {
		if ((tab.disabled && !anyValue) || tab.active) return;

		// 先设置以前选中的为false
		this.current.active = false;

		this.current = tab;
		this.current.active = true;

		this.onActive && this.onActive({tab: this.current});
		tab.onActive && tab.onActive(tab);
	}

	removeTab(tab) {
		if (this.tabs.length <= 1) return;

		// 找到需要删除的tab
		let removeIndex = this.tabs.indexOf(tab);
		let prevIndex = removeIndex - 1;
		let nextIndex = removeIndex + 1;
		let activeIndex = -1;

		this.tabs.splice(removeIndex, 1);

		if (!tab.active || !this.tabs.length) return;

		// 删除向前找选中目标
		if (prevIndex >= 0) {
			for (let i = prevIndex; i >= 0; i--) {
				if (!this.tabs[i].disabled) {
					activeIndex = i;
					break;
				}
			}
		}

		// 删除向后找选中目标
		if (activeIndex === -1 && nextIndex <= this.tabs.length) {
			for (let i = removeIndex; i <= nextIndex; i++) {
				if (!this.tabs[i].disabled) {
					activeIndex = i;
					break;
				}
			}
		}

		this.selectTab(this.tabs[activeIndex !== -1 ? activeIndex : 0], activeIndex === -1);
	}

}
