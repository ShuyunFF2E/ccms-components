/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-04
 */

angular.module('componentsApp', ['ccms.components', 'ngResource'])

	.controller('ctrl', function ($scope, $resource, $grid) {

		this.click = () => {
			console.log(this);
		};

		this.selectedItems = [];

		this.refreshGrid = function () {
			$grid.refresh(this.pagerGridOptions).then(() => this.selectedItems.length = 0);
		};

		this.refreshDataGrid = function () {
			$grid.refresh(this.dataGridOptions).then(() => console.log('data grid refreshed!'));
		};

		this.onRefresh = function (opts) {
			console.log(opts);
		};

		this.pagerGridOptions = {

			resource: $resource('/pages/1'),
			response: null,
			queryParams: {
				pageNum: 2
			},
			columnsDef: [
				{
					cellTemplate: '<span style="color:blue" ng-bind="entity.name" ng-click="app.click()" tooltip="entity.name" tooltip-append-to-body="true"></span>',
					displayName: '姓名',
					align: 'center',
					width: '100px',
					sort: {
						prop: 'name',
						onCompare: (prev, next) => {
							return prev['name'] > next['name'] ? -1 : 1;
						}
					}
				},
				{
					field: 'age', displayName: '年龄', align: 'center',
					sort: true
				},
				{
					field: 'gender', displayName: '性别', align: 'right',
					sort: (pre, next)=> {

						return pre['age'] > next['age'] ? -1 : 1;
					}
				}
			],
			transformer: {
				pageNum: 'currentPage',
				totals: 'totalCount'
			}
			// transformer: function (res) {
			// 	console.log(res);
			// 	return [];
			// }

			//headerTpl: '/demos/grid/test.html'

		};

		this.dataGridOptions = {

			externalData: [{name: 'kuitos', age: 10, gender: '男'}, {name: 'xxx', age: 11, gender: '女'}],
			// externalData: Promise.resolve([{name: 'kuitos', age: 10, gender: '男'}, {
			// 	name: 'xxx',
			// 	age: 11,
			// 	gender: '女'
			// }]),
			// response: null,
			columnsDef: [
				{
					cellTemplate: '<span style="color:blue" ng-bind="entity.name" ng-click="app.click()"></span>',
					displayName: '姓名',
					align: 'left'
				},
				{field: 'age', displayName: '年龄', align: 'center', sort: true},
				{field: 'gender', displayName: '性别', align: 'right'}
			],
			showPagination: false
		};

		this.gridOption3 = {

			externalData: [{name: 'kuitos', age: 10, gender: '男'}, {name: 'xxx', age: 11, gender: '女'}],
			columnsDef: [
				{
					cellTemplate: '<span style="color:blue" ng-bind="entity.name" ng-click="app.click()"></span>',
					displayName: '姓名',
					align: 'left'
				},
				{field: 'age', displayName: '年龄', align: 'center'},
				{field: 'gender', displayName: '性别', align: 'right'}
			],
			hiddenColumns: ['gender'],
			showPagination: false
		};

	});
