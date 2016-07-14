/**
 * @author fengqiu.wu
 */
import './_tabset.scss';

import template from './tpls/tab.tpl.html';
import {Inject} from 'angular-es-utils';

@Inject()
export default class TabDirective {

	constructor() {

		Object.assign(this, {
			require: {
				tabset: '^tabset'
			},
			transclude: true,
			bindings: {
				title: '@',
				onSelect: '&'
			},
			controllerAs: '$tab',
			template
		});

	}

}
