/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-08
 */

import angular from 'angular';

import './_tips.scss';

import bindHtml from '../bind-html';
import template from './normal-tips.tpl.html';
import controller from './TipsCtrl';
import TipsService from './TipsService';

const ddo = {
	template,
	controller,
	bindings: {
		msg: '@',
		type: '@?'
	}
};

export default angular
	.module('ccms.components.tips', [bindHtml])
	.component('tips', ddo)
	.service('TipsService', TipsService)
	.name;
