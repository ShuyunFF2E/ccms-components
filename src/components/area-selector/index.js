/**
 * @author DuYing
 * @homepage https://github.com/Dale-/
 * @since 12/23/16
 */

import angular from 'angular';
import bindHtml from '../bind-html';
import controller from './AreaSelectorCtrl';
import template from './area-seletor-body.tpl.html';
import AreaSelectorService from './AreaSelectorService';

const ddo = {
	template,
	controller
};

export default angular
	.module('ccms.components.areaSelector', [bindHtml])
	.component('ccAreaSelector', ddo)
	.value('$ccAreaSelector', AreaSelectorService)
	.name;
