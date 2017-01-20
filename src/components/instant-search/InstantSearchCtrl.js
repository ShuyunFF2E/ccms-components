import angular from 'angular';
import { Inject } from 'angular-es-utils';

@Inject('$scope', '$element', '$resource')
export default class InstantSearchCtrl {

	constructor() {
		this.searchText = '';
		this.searchResult = [];
		this._remoteSearch = false;
		this.isHintOpen = false;
		this.focusIndex = 0;
		this.resource = null;
	}

	$onInit() {
		this._prepareOptions();
		this._prepareWatches();
	}

	$postLink() {
		const scope = this.getScope();
		angular.element(this.getElement()).find('input')
			.on('focus', () => {
				this.openHintList();
				scope.$root.$$phase || scope.$apply();
			})

			.on('blur', () => {
				this.closeHintList();
				scope.$root.$$phase || scope.$apply();
			})

			.on('keydown', event => {
				switch (event.keyCode) {
					case 13: // enter
						this.selectFocusedItem();
						break;
					case 38: // up
						this.focusPreviousHint();
						event.preventDefault();
						break;
					case 40: // down
						this.focusNextHint();
						event.preventDefault();
						break;
					default:
						this.focusFirstHint();
				}
				scope.$root.$$phase || scope.$apply();
			});
	}

	_prepareOptions() {
		let options = this.options;

		options.valueField = options.valueField || 'value';
		options.displayField = options.displayField || 'title';

		if (options.url) {
			let params = {};

			this._remoteSearch = true;

			// 设置服务器端搜索查询参数
			params = {
				[options.remoteSearchParamKey]: () => {
					return this.searchText;
				}
			};

			this.resource = this.getResource()(options.url, null, {
				query: {
					method: 'GET',
					isArray: true,
					cache: true,
					params
				}
			}, {
				stripTrailingSlashes: false
			});
		} else {
			// 默认本地过滤 [valueField, displayField]
			options.localFilterFields = options.localFilterFields ||
					[options.valueField, options.displayField];
		}
	}

	_prepareWatches() {
		const scope = this.getScope();

		// 监视搜索关键字变化
		scope.$watch(() => this.searchText, searchText => {
			searchText = searchText.trim();
			if (searchText.length) {
				this.search(searchText);
			}
		});
	}

	search(text) {
		this.searchResult = [];
		if (this._remoteSearch) {
			this.resource.query()
				.$promise.then(datalist => {
					this.searchResult = datalist;
					if (this.onSearch) {
						this.onSearch({
							datalist: this.searchResult,
							context: { searchText: this.searchText }
						});
					}
				});
		} else {
			// 使用本地搜索
			const datalist = [...this.datalist];
			this.options.localFilterFields.forEach(field => {
				for (let i = datalist.length - 1; i > -1; i--) {
					let item = datalist[i];
					if (item[field].indexOf(text) !== -1) {
						this.searchResult.push(item);
						datalist.splice(i, 1);
					}
				}
			});
			if (this.onSearch) {
				this.onSearch({
					datalist: this.searchResult,
					context: { searchText: this.searchText }
				});
			}
		}
	}

	selectItem(item) {
		this.closeHintList();
		if (this.onSelect) {
			this.onSelect({ item, context: { searchText: this.searchText } });
		}
	}

	// 选择当前高亮的列表项目
	selectFocusedItem() {
		let item = this.datalist[this.focusIndex];
		this.selectItem(item);
	}

	focusPreviousHint() {
		if (--this.focusIndex < 0) {
			this.focusIndex = 0;
		}
	}

	focusNextHint() {
		let listCount = this.datalist.length;
		if (++this.focusIndex > listCount - 1) {
			this.focusIndex = listCount - 1;
		}
	}

	focusFirstHint() {
		this.isHintOpen = true;
		this.focusIndex = 0;
	}

	openHintList() {
		this.isHintOpen = true;
	}

	closeHintList() {
		this.isHintOpen = false;
	}

	getResource() {
		return this._$resource;
	}

	getScope() {
		return this._$scope;
	}

	getElement() {
		return this._$element[0];
	}
}
