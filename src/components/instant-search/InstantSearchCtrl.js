import { Inject } from 'angular-es-utils';

let $resource;

@Inject('$scope', '$element', '$resource')
export default class InstantSearchCtrl {

	constructor($scope, $element, resource) {
		$resource = resource;

		this.$scope = $scope;
		this.$element = $element;
		this.options = this.$scope.options;
		this.datalist = this.options.datalist || [];
		this.searchText = '';
		this.remoteSearch = false;
		this.isHintOpen = false;
		this.focusIndex = 0;
		this.resource = null;
	}

	$onInit() {
		let options = this.options;

		options.valueField = options.valueField || 'value';
		options.displayField = options.displayField || 'title';

		let params = {};
		if ((this.remoteSearch = !!options.remoteSearchParamKey)) {
			// 设置服务器端搜索查询参数
			params = {
				[options.remoteSearchParamKey]: () => {
					return this.searchText;
				}
			};
		} else {
			// 默认本地过滤 [valueField, displayField]
			options.localFilterFields = options.localFilterFields ||
					[options.valueField, options.displayField];
		}

		if (!this.datalist.length) {
			if (!options.url) {
				throw new Error('no options.datalist or options.url specified.');
			}

			// 设置数据来源
			this.remoteSearch = true;
			this.resource = $resource(options.url, null, {
				query: {
					method: 'GET',
					isArray: true,
					cache: true,
					params
				}
			}, {
				stripTrailingSlashes: false
			});
		}

		// 监视搜索关键字变化
		this.$scope.$watch('$ctrl.searchText', searchText => {
			searchText = searchText.trim();
			if (searchText.length) {
				this.search(searchText);
			}
		});
	}

	search(text) {
		if (this.remoteSearch) {
			this.resource.query()
				.$promise.then(datalist => {
					this.datalist = datalist;
				});
		} else {
			// 使用本地搜索
			const datalist = [...this.options.datalist];
			const searchResult = [];
			this.options.localFilterFields.forEach(field => {
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
	}

	selectItem(item) {
		this.searchText = item[this.options.displayField];
		this.$scope.selectedItem = item;
		this.closeHintList();
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

}
