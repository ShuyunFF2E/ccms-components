import './_dropdown-select.scss';
import template from './dropdown-select.tpl.html';
import DropdownSelectCtrl from './DropdownSelectCtrl';

/**
 * 下拉列表
 */
export default class DropdownSelect {

	constructor() {
		Object.assign(this, {
			template,
			controller: DropdownSelectCtrl,
			controllerAs: '$ctrl',
			scope: {
				selectedItem: '=model',
				options: '<'
			}
		});
	}

	link(scope, element, attrs, ctrl) {

		element.on('click', event => {
			event.stopPropagation();
		});

		element.find('input')
			.on('keydown', event => {
				switch (event.keyCode) {
					case 13: // enter
						ctrl.selectFocusedItem();
						break;
					case 38: // up
						ctrl.focusPrevious();
						event.preventDefault();
						break;
					case 40: // down
						ctrl.focusNext();
						event.preventDefault();
						break;
					default:
						ctrl.openList();
						ctrl.focusFirst();
				}
			});

	}

}
