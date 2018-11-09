import './index.scss';
import angular from 'angular';
import treeController from './TreeController';
import treeTemplate from './tree.tpl.html';

import treeListTemplate from './list/list.tpl.html';
import treeListController from './list/TreeListController.js';

import treeNodeController from './node/TreeNodeController';
import treeNodeTemplate from './node/node.tpl.html';

import treeMenu from './menu';


const treeDDO = {
	controller: treeController,
	template: treeTemplate,
	bindings: {
		data: '<',
		filter: '<?',
		selectAll: '<?',
		onClickAction: '<?',
		onRemoveAction: '<?',
		onAddAction: '<?',
		onRenameAction: '<?'
	}
};


const treeListDDO = {
	controller: treeListController,
	template: treeListTemplate,
	bindings: {
		nodes: '<',
		filter: '<?',
		onOpenMenu: '<?'
	}
};


const treeNodeDDO = {
	controller: treeNodeController,
	template: treeNodeTemplate,
	bindings: {
		node: '<',
		filter: '<?',
		onOpenMenu: '<?'
	}
};


export default angular.module('ccms.components.tree', [treeMenu])
	.component('ccTree', treeDDO)
	.component('ccTreeList', treeListDDO)
	.component('ccTreeNode', treeNodeDDO)
	.name;
