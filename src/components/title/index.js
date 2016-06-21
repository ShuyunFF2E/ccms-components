/**
 * Created with index.js
 * @Description:
 * @Author: muchaoyang
 * @Date: 2016-06-01 10:34 AM
 * To change this template use File | Settings | File Templates.
 */
import angular from 'angular';

import './_title-with-prefixed-icon.scss';
import template from './title.tpl.html';
import controller from './TitleCtrl';

const titleDOO = {
	template,
	controller,
	controllerAs: 'title',
	bindings: {
		name: '='
	}
};

export default angular
	.module('ccms.components.title', [])
	.component('navTitle', titleDOO)
	.name;
