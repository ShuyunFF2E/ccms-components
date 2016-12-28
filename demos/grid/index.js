/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-04
 */

angular.module('componentsApp', ['ccms.components', 'ngResource'])

	.controller('ctrl', function ($scope, $resource, $ccGrid) {

		this.click = () => {
			console.log(this);
		};

		this.selectedItems = [];

		this.refreshGrid = function () {
			$ccGrid.refresh(this.pagerGridOptions).then(opts => this.selectedItems.length = 0);
		};

		this.refreshDataGrid = function () {
			$ccGrid.refresh(this.dataGridOptions).then(opts => console.log('data grid refreshed!', opts));
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
			// multipleFieldsSort:true,
			columnsDef: [
				{
					cellTemplate: '<span style="color:blue" ng-bind="entity.name" ng-click="app.click()" cc-tooltip="entity.name" tooltip-append-to-body="true"></span>',
					displayName: '姓名',
					align: 'center',
					width: '100px',
					sortProp: 'name',
					sortOrder:'asc'
				},
				{
					field: 'age',
					displayName: '年龄', align: 'center',
					sortProp: 'age',
					sortOrder:'asc'
				},
				{
					field: 'gender',
					displayName: '性别',
					align: 'right',
					width: '100px',
					cellTemplate: '<span>123123123123123123123123123123123123123123123123</span>'
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

		this.pagerGridOptions2 = {

			resource: $resource('/pages/1'),
			response: null,
			queryParams: {
				pageNum: 2
			},
			columnsDef: [
				{
					cellTemplate: '<span style="color:blue" ng-bind="entity.name" ng-click="app.click()" cc-tooltip="entity.name" tooltip-append-to-body="true"></span>',
					displayName: '姓名',
					align: 'center',
					width: '100px',
					sortProp: 'name'
				},
				{field: 'age', displayName: '年龄', align: 'center', sortOrder: 'age'},
				{
					field: 'gender',
					displayName: '性别',
					align: 'right',
					width: '100px',
					cellTemplate: '<span>123123123123123123123123123123123123123123123123</span>'
				}
			],
			rowTpl: '/demos/grid/customer-row.html',
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
				{field: 'age', displayName: '年龄', align: 'center'},
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
				{field: 'gender', displayName: '性别', align: 'right', isHidden: true}
			],
			enableHiddenColumns: true,
			showPagination: false
		};

	});
