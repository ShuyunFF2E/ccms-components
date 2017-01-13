(function (angular) {

	angular.module('componentsApp', ['ccms.components', 'ngResource'])

		.controller('ctrl', function ($scope, $resource, $ccGrid, $filter) {

			const gridData = [
				{ name: 'kuitos', age: 10, gender: '男' }, { name: 'xxx', age: 111, gender: '女' },
				{ name: 'kuitos', age: 11, gender: '男' }, { name: 'xxx', age: 112, gender: '女' },
				{ name: 'kuitos', age: 12, gender: '男' }, { name: 'xxx', age: 113, gender: '女' },
				{ name: 'kuitos', age: 13, gender: '男' }, { name: 'xxx', age: 114, gender: '女' },
				{ name: 'kuitos', age: 14, gender: '男' }, { name: 'xxx', age: 115, gender: '女' },
				{ name: 'kuitos', age: 15, gender: '男' }, { name: 'xxx', age: 116, gender: '女' },
				{ name: 'kuitos', age: 16, gender: '男' }, { name: 'xxx', age: 117, gender: '女' },
				{ name: 'kuitos', age: 17, gender: '男' }, { name: 'xxx', age: 118, gender: '女' },
				{ name: 'kuitos', age: 18, gender: '男' }, { name: 'xxx', age: 119, gender: '女' },
				{ name: 'kuitos', age: 19, gender: '男' }, { name: 'xxx', age: 120, gender: '女' },
				{ name: 'kuitos', age: 100, gender: '男' }, { name: 'xxx', age: 121, gender: '女' },
				{ name: 'kuitos', age: 101, gender: '男' }, { name: 'xxx', age: 122, gender: '女' },
				{ name: 'kuitos', age: 102, gender: '男' }, { name: 'xxx', age: 123, gender: '女' },
				{ name: 'kuitos', age: 103, gender: '男' }, { name: 'xxx', age: 124, gender: '女' },
				{ name: 'kuitos', age: 104, gender: '男' }, { name: 'xxx', age: 125, gender: '女' },
				{ name: 'kuitos', age: 105, gender: '男' }, { name: 'xxx', age: 126, gender: '女' },
				{ name: 'kuitos', age: 106, gender: '男' }, { name: 'xxx', age: 127, gender: '女' },
			];

			this.selectedItems = [];

			let filteredData = [];

			const wrapGridData = (currentPage, pageSize, data) => {
				this.dataGridOptions.pager.pageNum = currentPage;
				this.dataGridOptions.pager.pageSize = pageSize;
				this.dataGridOptions.pager.totalPages = Math.ceil((data.length || 0) / 2);
				this.dataGridOptions.externalData = data.slice(pageSize * (currentPage - 1), pageSize * currentPage);
				return this.dataGridOptions;
			};

			this.onSearch = name => {
				const currentPage = 1;
				const pageSize = 2;
				filteredData = $filter('filter')(gridData, name);
				$ccGrid.refresh(wrapGridData(currentPage, pageSize, filteredData));
			};

			this.onRefresh = opts => {
				const currentPage = opts.pager.pageNum;
				const pageSize = opts.pager.pageSize;
				const data = filteredData.length ? filteredData : gridData;
				$ccGrid.refresh(wrapGridData(currentPage, pageSize, data));
			};

			this.dataGridOptions = {
				columnsDef: [
					{
						cellTemplate: '<span style="color:blue" ng-bind="entity.name" ng-click="app.click()"></span>',
						displayName: '姓名',
						align: 'left'
					},
					{ field: 'age', displayName: '年龄', align: 'center' },
					{ field: 'gender', displayName: '性别', align: 'right' }
				],
				pager: {
					pageNum: 1,  // 当前页码
					pageSize: 2, // 每页大小
					pageSizeList: [2],
					pageSizeListDisabled: false
				}
			};

		});

})(window.angular);
