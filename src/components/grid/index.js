/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-04
 */
import angular from 'angular';

import loading from '../loading';
import dynamicAttr from '../dynamic-attr';
import checkbox from '../checkbox';

import './_grid.scss';
import template from './grid.tpl.html';
import controller from './GridCtrl';
import link from './GridCellLink';

import $grid from './GridHelper';

const
	gridDDO = {
		template,
		controller,
		bindings: {
			opts: '=',
			selectedItems: '=?',
			type: '@?',
			onRefresh: '&?'
		}
	},

	gridCellDDO = {
		restrict: 'E',
		link,
		scope: {
			entity: '<',
			column: '<'
		}
	};

export default angular
	.module('ccms.components.grid', [loading, dynamicAttr, checkbox])
	.component('ccGrid', gridDDO)
	.deprecatedComponent('grid', gridDDO)
	.directive('ccGridCell', () => gridCellDDO)
	.deprecatedValue('$ccGrid', $grid, '$grid 服务将在8.30之后废弃,请尽早使用 $ccGrid 服务代替!')
	.value('$ccGrid', $grid)
	.name;
