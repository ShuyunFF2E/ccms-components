import './index.scss';
import angular from 'angular';
import treeController from './TreeController';
import treeTemplate from './tree.tpl.html';

import treeListTemplate from './list/list.tpl.html';
import treeListController from './list/TreeListController.js';

import treeNodeController from './node/TreeNodeController';
import treeNodeTemplate from './node/node.tpl.html';

import checkbox from '../checkbox';
import treeMenu from './menu';
import treeSearch from './search';


const treeDDO = {
	controller: treeController,
	template: treeTemplate,
	bindings: {
		data: '<',
		isRadioModel: '<?',
		supportSearch: '<?',
		supportCheckbox: '<?',
		onClickAction: '<?',
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
		nodes: '<',
		supportCheckbox: '<?',
		onOpenMenu: '<?'
	}
};


const treeNodeDDO = {
	controller: treeNodeController,
	template: treeNodeTemplate,
	bindings: {
		node: '<',
		supportCheckbox: '<?',
		onOpenMenu: '<?'
	}
};


export default angular.module('ccms.components.tree', [checkbox, treeMenu, treeSearch])
	.component('ccTree', treeDDO)
	.component('ccTreeList', treeListDDO)
	.component('ccTreeNode', treeNodeDDO)
	.name;
