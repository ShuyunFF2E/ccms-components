import { Inject } from 'angular-es-utils';

@Inject('$scope', '$element', 'dropdownService')
export default class DropdownSelectCtrl {

	constructor($scope, $element, dropdownService) {
		this.$scope = $scope;
		this.$element = $element;
		this.dropdownService = dropdownService;
		this.options = this.$scope.options;
		this.options.searchable = Boolean(this.options.searchable);
		this.searchText = '';
		this.datalist = this.options.datalist || [];
		this.isOpen = false;
		this.focusIndex = this.options.searchable ? 0 : -1;
	}

	$onInit() {
		let options = this.options;

		options.valueField = options.valueField || 'value';
		options.displayField = options.displayField || 'title';

		// 即时搜索
		options.searchable && this.$scope.$watch('$ctrl.searchText', searchText => {
			searchText = searchText.trim();
			if (searchText.length) {
				this.search(searchText);
			} else {
				this.datalist = [...options.datalist];
			}
		});
	}

	search(text) {
		let
			options = this.options,
			datalist = [...options.datalist],
			searchFields = [options.valueField, options.displayField],
			searchResult = [];

		searchFields.forEach(field => {
			for (let i = datalist.length - 1; i > -1; i--) {
				let item = datalist[i];
				if (item[field].indexOf(text) !== -1) {
					searchResult.push(item);
					datalist.splice(i, 1);
				}
			}
		});

		this.datalist = searchResult;
	}

	selectItem(item) {
		this.searchText = item[this.options.displayField];
		this.$scope.selectedItem = item;
		this.closeList();
	}

	selectFocusedItem() {
		this.selectItem(this.datalist[this.focusIndex]);
	}

	clearSelection() {
		this.searchText = '';
		this.$scope.selectedItem = null;
	}

	focusFirst() {
		this.focusIndex = 0;
		this.$scope.$root.$$phase || this.$scope.$apply();
	}

	focusPrevious() {
		if (--this.focusIndex < 0) {
			this.focusIndex = 0;
		}
		this.$scope.$root.$$phase || this.$scope.$apply();
	}

	focusNext() {
		let listCount = this.datalist.length;
		if (++this.focusIndex > listCount - 1) {
			this.focusIndex = listCount - 1;
		}
		this.$scope.$root.$$phase || this.$scope.$apply();
	}

	toggleList() {
		if (this.isOpen) {
			this.closeList();
		} else {
			this.openList();
		}
	}

	openList() {
		this.isOpen = true;
		this.$scope.$root.$$phase || this.$scope.$apply();
		this.dropdownService.open(this);
	}

	closeList() {
		this.isOpen = false;
		this.$scope.$root.$$phase || this.$scope.$apply();
		this.dropdownService.close();
	}

}
