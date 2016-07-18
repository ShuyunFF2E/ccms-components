/**
 * Created with index.js
 * @Description:
 * @Author: maxsmu
 * @Date: 2016-06-01 10:34 AM
 */
import angular from 'angular';
import './_title-with-prefixed-icon.scss';
import template from './title.tpl.html';
import controller from './TitleCtrl';
const titleDDO = {
	template,
	controller,
	controllerAs: 'title',
	bindings: {
		name: '='
	}
};

export default angular
	.module('ccms.components.title', [])
	.component('navTitle', titleDDO)
	.name;
