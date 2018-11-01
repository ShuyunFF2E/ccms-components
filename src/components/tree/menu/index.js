import './index.scss';
import angular from 'angular';
import template from './index.tpl.html';

const ddo = {
	template,
	bindings: {
		cmStyle: '<',
		selectedId: '<',
		items: '<'
	}
};

const rightClickFactory = $parse => {
	return (scope, element, attrs) => {
		const fn = $parse(attrs.ccTreeRightClick);
		element.bind('contextmenu', event => {
			scope.$apply(() => {
				event.preventDefault();
				fn(scope, { $event: event });
			});
		});
	};
};

export default angular
	.module('ccms.components.treeMenu', [])
	.component('ccTreeMenu', ddo)
	.directive('ccTreeRightClick', rightClickFactory)
	.name;
