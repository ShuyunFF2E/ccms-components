/**
 * Created with TitleDirective.js
 * @Description:
 * @Author: muchaoyang
 * @Date: 2016-06-01 10:43 AM
 * To change this template use File | Settings | File Templates.
 */
import './_title-with-prefixed-icon.scss';
import template from './title.tpl.html';
import TitleCtrl from './TitleCtrl';

export default class Title {

	constructor() {
		this.template = template;
		this.controller = TitleCtrl;
		this.controllerAs = 'title';
		this.bindings = {
			name: '='
		};
	}
}
