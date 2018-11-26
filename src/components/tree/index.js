import './index.scss';
import angular from 'angular';
import treeController from './TreeController';
import treeTemplate from './tree.tpl.html';

import treeListTemplate from './list/list.tpl.html';
import treeListController from './list/TreeListController.js';

import treeNodeController from './node/TreeNodeController';
import treeNodeTemplate from './node/node.tpl.html';

import ccCheckbox from '../checkbox';
import ccRadio from '../radio';
import treeMenu from './menu';
import treeSearch from './search';


const treeDDO = {
	controller: treeController,
	template: treeTemplate,
	bindings: {
		data: '<',
		supportMenu: '<?',
		supportSearch: '<?',
		supportCheckbox: '<?',
		isRadioModel: '<?',
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
		treeMap: '<',
		nodes: '<',
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
		supportCheckbox: '<?',
		isRadioModel: '<?',
		onOpenMenu: '<?'
	}
};


export default angular.module('ccms.components.tree', [ccCheckbox, ccRadio, treeMenu, treeSearch])
	.component('ccTree', treeDDO)
	.component('ccTreeList', treeListDDO)
	.component('ccTreeNode', treeNodeDDO)
	.name;
