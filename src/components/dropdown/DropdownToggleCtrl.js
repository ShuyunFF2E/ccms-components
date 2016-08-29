import { Inject, Bind } from 'angular-es-utils';

@Inject('$element')
export default class DropdownToggleCtrl {
	$postLink() {
		this.getElement().addEventListener('click', this.toggle);
	}

	getElement() {
		return this._$element[0];
	}

	@Bind
	toggle(event) {
		let dropdownCtrl = this.parent;
		if (dropdownCtrl.isOpen) {
			dropdownCtrl.close();
		} else {
			dropdownCtrl.open();
		}
		event.stopPropagation();
	}
}

