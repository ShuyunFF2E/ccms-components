/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-08
 */
import './_tips.scss';
import template from './normal-tips.tpl.html';
import TipsCtrl from './TipsCtrl';

export default class TipsDirective {

	constructor() {
		this.template = template;
		this.controller = TipsCtrl;
		this.bindings = {
			msg: '@',
			type: '@?'
		};
	}

}
