/**
 * @author fengqiu.wu
 */
import './_tabset.scss';

import TabsCtrl from './TabsetCtrl';
import template from './tpls/tabset.tpl.html';

export default class TabsetComponent {

	constructor() {

		Object.assign(this, {
			transclude: true,
			template,
			bindings: {
				tabs: '='
			},
			controller: TabsCtrl,
			controllerAs: '$tabsetCtrl'
		});

	}

}
