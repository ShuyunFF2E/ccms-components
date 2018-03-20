import './_tree.scss';

import angular from 'angular';
import treeTemplate from './tree.tpl.html';
import treeItemTemplate from './tree-item.tpl.html';

import TreeCtrl from './TreeCtrl';
import TreeItemCtrl from './TreeItemCtrl';

const treeDDO = {
	restrict: 'E',
	template: treeTemplate,
	scope: {
		treeData: '<',
		onSelected: '&',
		hasCheckbox: '<',
		selectedIds: '<'
	},
	bindToController: true,
	controller: TreeCtrl,
	controllerAs: '$ctrl'
};


const treeItemDDO = {
	restrict: 'E',
	template: treeItemTemplate,
	scope: {
		data: '<',
		parentId: '<'
	},
	bindToController: true,
	controllerAs: '$ctrl',
	replace: true,
	require: '^^ccTree',
	controller: TreeItemCtrl,
	link: function(scope, element, attrs, $ctrl) {
		$ctrl.scopes.push(scope);
		scope.$ctrl.hasCheckbox = $ctrl.hasCheckbox;
		if (!$ctrl.hasCheckbox) {
			scope.$ctrl.selected = $ctrl.selectedIds ? $ctrl.selectedIds.includes(scope.$ctrl.data.id) : false;
		}
	}
};

export default angular.module('ccms.components.tree', [])
	.directive('ccTreeItem', () => treeItemDDO)
	.directive('ccTree', () => treeDDO)
	.name;
