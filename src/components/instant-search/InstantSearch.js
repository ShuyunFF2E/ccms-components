import './_instant-search.scss';
import template from './instant-search.tpl.html';
import InstantSearchCtrl from './InstantSearchCtrl';

/**
 * 即时搜索
 */
export default class InstantSearch {

	constructor() {
		Object.assign(this, {
			template,
			controller: InstantSearchCtrl,
			controllerAs: '$ctrl',
			scope: {
				selectedItem: '=model',
				options: '<'
			}
		});
	}

	link(scope, element, attrs, ctrl) {
		element.find('input')

			.on('focus', () => {
				ctrl.openHintList();
				scope.$apply();
			})

			.on('blur', () => {
				ctrl.closeHintList();
				scope.$apply();
			})

			.on('keydown', event => {
				switch (event.keyCode) {
					case 13: // enter
						ctrl.selectFocusedItem();
						break;
					case 38: // up
						ctrl.focusPreviousHint();
						event.preventDefault();
						break;
					case 40: // down
						ctrl.focusNextHint();
						event.preventDefault();
						break;
					default:
						ctrl.focusFirstHint();
				}
				scope.$apply();
			});
	}

}
