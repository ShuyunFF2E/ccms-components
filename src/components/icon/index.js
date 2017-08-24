/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-03
 */

import angular from 'angular';
import template from './index.tpl.html';
import 'ccms-icons';
import './index.scss';

const ddo = {
	template,
	bindings: {
		symbol: '@',
		className: '@'
	}
};

export default angular
	.module('ccms.components.icon', [])
	.component('ccIcon', ddo)
	.name;
