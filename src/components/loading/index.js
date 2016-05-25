/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-08
 */

import angular from 'angular';

import LoadingDirective from './LoadingDirective';

export default angular
	.module('ccms.components.loading', [])
	.component('loading', new LoadingDirective())
	.name;
