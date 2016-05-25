import { Inject } from 'angular-es-utils';

@Inject('$document')
export default class DropdownService {

	constructor() {
		this.lastDropdownCtrl = null;
	}

	open(dropdownCtrl) {
		if (!this.lastDropdownCtrl) {
			this.$document.on('click', ::dropdownCtrl.closeList);
		} else if (this.lastDropdownCtrl !== dropdownCtrl) {
			this.lastDropdownCtrl.closeList();
		}
		this.lastDropdownCtrl = dropdownCtrl;
	}

	close() {
		if (this.lastDropdownCtrl) {
			this._$document.off('click', ::this.lastDropdownCtrl.closeList);
			this.lastDropdownCtrl = null;
		}
	}

}
