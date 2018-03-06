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
		data: '<',
		onSelected: '&',
		hasCheckbox: '<'
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
	}
};

export default angular.module('ccms.components.tree', [])
	.directive('ccTreeItem', () => treeItemDDO)
	.directive('ccTree', () => treeDDO)
	.name;
