/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-04
 */

angular.module('componentsApp', ['ccms.components', 'ngResource'])

	.config(function($resourceProvider) {
		// 开启 cancelRequest 功能
		$resourceProvider.defaults.cancellable = true;
	})

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
			// enableMultipleFieldsSort:true,
			columnsDef: [
				{
					cellTemplate: '<span style="color:#145681" ng-bind="entity.name" ng-click="app.click()" cc-tooltip="entity.name" tooltip-append-to-body="true"></span>',
					displayName: '姓名',
					align: 'center',
					width: '100px',
					tooltip: '这是一个tooltip!'
				},
				{
					field: 'age',
					displayName: '年龄', align: 'center',
					tooltip: '这是一个tooltip!'
				},
				{
					field: 'gender',
					displayName: '性别',
					align: 'right',
					width: '100px',
					cellTemplate: '<span>123123123123123123123123123123123123123123123123</span>',
					tooltip: '这是一个tooltip!'
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

			//headerTpl: '/demos/components/grid/test.html'

		};

		this.pagerGridOptions2 = {

			resource: $resource('/pages/1'),
			response: null,
			queryParams: {
				pageNum: 2
			},
			columnsDef: [
				{
					cellTemplate: '<span style="color:#145681" ng-bind="entity.name" ng-click="app.click()" cc-tooltip="entity.name" tooltip-append-to-body="true"></span>',
					displayName: '姓名',
					align: 'center',
					width: '100px',
					sortProp: 'name',
					tooltip: '这是一个测试'
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
			rowTpl: '/demos/components/grid/customer-row.html',
			transformer: {
				pageNum: 'currentPage',
				totals: 'totalCount'
			}
			// transformer: function (res) {
			// 	console.log(res);
			// 	return [];
			// }

			//headerTpl: '/demos/components/grid/test.html'

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
					cellTemplate: '<span style="color:#145681" ng-bind="entity.name" ng-click="app.click()"></span>',
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
					cellTemplate: '<span style="color:#145681" ng-bind="entity.name" ng-click="app.click()"></span>',
					displayName: '姓名',
					align: 'left'
				},
				{field: 'age', displayName: '年龄', align: 'center'},
				{field: 'gender', displayName: '性别(这是一个超长的 column 名称)', align: 'right', isHidden: true, tooltip: '这是一个测试'}
			],
			enableHiddenColumns: true,
			showPagination: false
		};

		this.gridOption4 = {

			resource: $resource('/pages/10'),
			columnsDef: [
				{
					cellTemplate: '<span style="color:#145681" ng-bind="entity.name" ng-click="app.click()"></span>',
					displayName: '姓名',
					align: 'left'
				},
				{field: 'age', displayName: '年龄', align: 'center'},
				{field: 'gender', displayName: '性别', align: 'right', isHidden: true}
			],
			enableHiddenColumns: true
		};

		this.gridOption5 = {

			externalData: [],
			columnsDef: [
				{
					cellTemplate: '<span style="color:#145681" ng-bind="entity.name" ng-click="app.click()"></span>',
					displayName: '姓名',
					align: 'left'
				},
				{field: 'age', displayName: '年龄', align: 'center'},
				{field: 'gender', displayName: '性别', align: 'right', isHidden: true}
			],
			enableHiddenColumns: true
		};

	});
