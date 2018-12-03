import angular from 'angular';
import template from './search.tpl.html';
import TreeSearchController from './TreeSearchController';

const ddo = {
	controller: TreeSearchController,
	template,
	bindings: {
		treeMap: '<',
		searchPlaceholder: '<?',
		onDone: '&'
	}
};


export default angular
	.module('ccms.components.treeSearch', [])
	.component('ccTreeSearch', ddo)
	.name;

