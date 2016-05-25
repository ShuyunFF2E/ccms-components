/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-08
 */

import './_loading.scss';
import template from './loading.tpl.html';

export default class Loading {

	constructor() {
		this.template = template;
		this.bindings = {
			type: '@?'
		};
	}

}
