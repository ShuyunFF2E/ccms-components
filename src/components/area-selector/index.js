/**
 * @author DuYing
 * @homepage https://github.com/Dale-/
 * @since 12/23/16
 */

import angular from 'angular';
import bindHtml from '../bind-html';
import AreaSelectorService from './AreaSelectorService';
import AreaSelectorProvider from './AreaSelectorProvider';

export default angular
	.module('ccms.components.areaSelector', [bindHtml])
	.provider('ccAreaSelector', AreaSelectorProvider)
	.value('$ccAreaSelector', AreaSelectorService)
	.run(['ccAreaSelector', function(ccAreaSelector) {
		ccAreaSelector.initData();
	}])
	.name;
