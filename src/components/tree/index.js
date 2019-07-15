import './index.scss';
import angular from 'angular';
import treeController from './TreeController';
import treeTemplate from './tree.tpl.html';

import treeListTemplate from './list/list.tpl.html';
import treeListController from './list/TreeListController.js';

import treeNodeController from './node/TreeNodeController';
import treeNodeTemplate from './node/node.tpl.html';

import menuController from './menu/menuController';
import menuTemplate from './menu/menu.tpl.html';

import ccCheckbox from '../checkbox';
import ccRadio from '../radio';

import treeSearch from './search';

const menuDDO = {
	controller: menuController,
	template: menuTemplate,
	bindings: {
		menuHash: '<',
		maxLevel: '<?',
		treeMap: '<',
		maxLevel: '<?',
		addToPosition: '<?',
		activeNode: '<'
	}
};

const treeDDO = {
	controller: treeController,
	template: treeTemplate,
	bindings: {
		data: '<',
		searchPlaceholder: '<?',
		searchMaxLen: '<?',
		nodeMaxLen: '<?',
		maxLevel: '<?',
		supportMenu: '<?',
		supportSearch: '<?',
		supportCheckbox: '<?',
		isRadioModel: '<?',
		addToPosition: '<?',
		onSelectedAction: '<?',
		onRemoveAction: '<?',
		onAddAction: '<?',
		onRenameAction: '<?'
	}
};


const treeListDDO = {
	controller: treeListController,
	template: treeListTemplate,
	bindings: {
		treeMap: '<',
		nodes: '<',
		searchText: '<',
		nodeMaxLen: '<',
		supportCheckbox: '<?',
		isRadioModel: '<?',
		onOpenMenu: '<?'
	}
};


const treeNodeDDO = {
	controller: treeNodeController,
	template: treeNodeTemplate,
	bindings: {
		treeMap: '<',
		node: '<',
		searchText: '<',
		nodeMaxLen: '<',
		supportCheckbox: '<?',
		isRadioModel: '<?',
		onOpenMenu: '<?'
	}
};

const rightClickDirective = $parse => {
	return {
		link: (scope, element, attrs) => {
			const fn = $parse(attrs.ccTreeRightClick);
			element.bind('contextmenu', event => {
				scope.$apply(() => {
					event.preventDefault();
					fn(scope, { $event: event });
				});
			});
		}
	};
};

export default angular.module('ccms.components.tree', [ccCheckbox, ccRadio, treeSearch])
	.component('ccTree', treeDDO)
	.component('ccTreeList', treeListDDO)
	.component('ccTreeNode', treeNodeDDO)
	.component('ccTreeMenu', menuDDO)
	.directive('ccTreeRightClick', ['$parse', rightClickDirective])
	.name;
