/**
 * @author fengqiu.wu
 */

import {Inject} from 'angular-es-utils';

@Inject()
export default class TabsetCtrl {

	$onInit() {
		let activeIndex = 0;

		this.tabs = this.tabs || [];

		// 以最后一项设置的active为主
		this.tabs.forEach((tab, index) => {
			tab.active && (activeIndex = index);
		});

		if (this.tabs[activeIndex]) {
			this.current = this.tabs[activeIndex];
			this.current.active = true;
		}
	}

	selectTab(tab, anyValue) {

		if ((tab.disabled && !anyValue) || tab.active) return;

		// 先设置以前选中的为false
		this.current.active = false;

		this.current = tab;
		this.current.active = true;
		tab.event && tab.event(tab);
	}

	removeTab(tab) {
		// 找到需要删除的tab
		let removeIndex = this.tabs.indexOf(tab);
		let prevIndex = removeIndex - 1;
		let nextIndex = removeIndex + 1;
		let activeIndex = -1;

		this.tabs.splice(removeIndex, 1);

		if (!tab.active || !this.tabs.length) return;

		if (prevIndex >= 0) {
			for (let i = prevIndex; i >= 0; i--) {
				if (!this.tabs[i].disabled) {
					activeIndex = i;
					break;
				}
			}
		}

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
