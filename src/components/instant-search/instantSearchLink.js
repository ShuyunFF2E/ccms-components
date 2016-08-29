import './_instant-search.scss';

/**
 * 即时搜索
 */
export default function instantSearchLink(scope, element, attrs, ctrl) {

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
