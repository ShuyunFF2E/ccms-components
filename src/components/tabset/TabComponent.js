/**
 * @author fengqiu.wu
 */
import './_tabset.scss';

import angular from 'angular';
import template from './tpls/tab.tpl.html';
import {Inject} from 'angular-es-utils';

@Inject()
export default class TabDirective {

	constructor() {

		Object.assign(this, {
			require: {
				tabset: '^tabset'
			},
			bindings: {
				tab: '=data'
			},
			controllerAs: '$tabCtrl',
			template
		});

	}

	controller() {
		let vm = this;

		vm.select = evt => {
			let tab = vm.tab;

			if (angular.element(evt.target).hasClass('btn-remove')) {
				vm.tabset.removeTab(tab);
				return;
			}

			if (tab.disabled || tab.active) {
				return;
			}

			vm.tabset.tabs.forEach(item => {
				item.active = false;
			});

			tab.active = true;
			tab.event && tab.event(tab);
			vm.tabset.current = tab;
		};
	}
}
