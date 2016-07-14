/**
 * @author fengqiu.wu
 */

import angular from 'angular';
import {Inject} from 'angular-es-utils';


@Inject('$scope')
export default class TabsetCtrl {

	$onInit() {

		this.tabs = [];
		this.active = this.active || 0;

		let oldIndex = null;
		let scope = this._$scope;

		scope.$watch('$tabset.active', index => {
			if (angular.isDefined(index) && index !== oldIndex) {
				this.selectTab(this.findIndex(index));
			}
		});
	}

	findIndex(index) {
		let findIndex = -1;
		this.tabs.forEach((tab, i) => {
			if (tab.index === index) {
				findIndex = i;
			}
		});
		return findIndex;
	}

	selectTab(index, tab) {
		if (index === undefined && this.active === undefined) return;

		this.active = index;
		tab && tab.onSelect && tab.onSelect({tab: {
			index: tab.index,
			title: tab.title,
			contents: tab.contents
		}});
	}

	addTab(tab) {
		tab.index = this.tabs.length;
		this.tabs.push({
			tab,
			index: tab.index
		});

		if (tab.index === this.active || !angular.isDefined(this.active) && this.tabs.length === 1) {
			const activeIndex = this.findIndex(tab.index);
			this.selectTab(activeIndex, this.tabs[activeIndex]);
		}
	}
}
