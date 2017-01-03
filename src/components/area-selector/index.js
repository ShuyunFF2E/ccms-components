/**
 * @author DuYing
 * @homepage https://github.com/Dale-/
 * @since 12/23/16
 */

import angular from 'angular';
import bindHtml from '../bind-html';
import AreaSelectorService from './AreaSelectorService';

export default angular
	.module('ccms.components.areaSelector', [bindHtml])
	.value('$ccAreaSelector', AreaSelectorService)
	.name;
