import { Inject } from 'angular-es-utils';

@Inject('$element')
export default class DropdownPanelCtrl {
	$onInit() {
		this.parent.panelCtrl = this;
	}

	getElement() {
		return this._$element[0];
	}

	show() {
		this.getElement().classList.remove('hide');
	}

	hide() {
		this.getElement().classList.add('hide');
	}
}

