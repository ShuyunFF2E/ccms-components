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
import GRID_TEMPLATES from './Constant';

const
	gridDDO = {
		template,
		controller,
		bindings: {
			opts: '=',
			selectedItems: '=?',
			type: '@?'
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
	.component('grid', gridDDO)
	.directive('gridCell', () => gridCellDDO)
	.value('$grid', $grid)
	.constant('GRID_TEMPLATES', GRID_TEMPLATES)
	.name;
