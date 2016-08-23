/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-08
 */

import angular from 'angular';

import './_loading.scss';
import template from './loading.tpl.html';

const ddo = {
	template,
	transclude: true,
	bindings: {
		type: '@?'  // loading 类型: default | layer(带背景层)
	}
};

export default angular
	.module('ccms.components.loading', [])
	.component('ccLoading', ddo)
	.deprecatedComponent('loading', ddo)
	.name;
