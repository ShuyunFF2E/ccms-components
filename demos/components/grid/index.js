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

		this.beforeRefresh = function (opts, queryParams) {
			console.log('before refresh:', opts, queryParams);
			// queryParams.pageNum = 10000;
			// queryParams.test = 'test';
			// 如果你想修改参数
			Object.assign(queryParams, {pageNum: 2, pageSize: 20, sortProps: "", sortOrders: "", page: 2});
			// queryParams = {pageNum: 2, pageSize: 20, sortProps: "", sortOrders: "", page: 2};
		};

		this.pagerGridOptions = {

			resource: null,
			externalData: [
				{
					"name": "旗木卡卡西",
					"age": 25,
					"gender": "男"
				},
				{
					"name": "野原新之助",
					"age": 5,
					"gender": "男"
				},
				{
					"name": "藤原拓海",
					"age": 20,
					"gender": "男"
				},
				{
					"name": "朽木露基亚",
					"age": 18,
					"gender": "女"
				},
				{
					"name": "毛利兰",
					"age": 18,
					"gender": "女"
				},
				{
					"name": "江户川乱步",
					"age": "不详",
					"gender": "男"
				},
				{
					"name": "旗木卡卡西1",
					"age": 25,
					"gender": "男"
				},
				{
					"name": "野原新之助1",
					"age": 5,
					"gender": "男"
				},
				{
					"name": "藤原拓海1",
					"age": 20,
					"gender": "男"
				},
				{
					"name": "朽木露基亚1",
					"age": 18,
					"gender": "女"
				},
				{
					"name": "毛利兰1",
					"age": 18,
					"gender": "女"
				},
				{
					"name": "江户川乱步1",
					"age": "不详",
					"gender": "男"
				},
				{
					"name": "旗木卡卡西2",
					"age": 25,
					"gender": "男"
				},
				{
					"name": "野原新之助2",
					"age": 5,
					"gender": "男"
				},
				{
					"name": "藤原拓海2",
					"age": 20,
					"gender": "男"
				},
				{
					"name": "朽木露基亚2",
					"age": 18,
					"gender": "女"
				},
				{
					"name": "毛利兰2",
					"age": 18,
					"gender": "女"
				},
				{
					"name": "江户川乱步2",
					"age": "不详",
					"gender": "男"
				},
				{
					"name": "旗木卡卡西3",
					"age": 25,
					"gender": "男"
				},
				{
					"name": "野原新之助3",
					"age": 5,
					"gender": "男"
				},
				{
					"name": "藤原拓海3",
					"age": 20,
					"gender": "男"
				},
				{
					"name": "朽木露基亚3",
					"age": 18,
					"gender": "女"
				},
				{
					"name": "毛利兰3",
					"age": 18,
					"gender": "女"
				},
				{
					"name": "江户川乱步3",
					"age": "不详",
					"gender": "男"
				},
				{
					"name": "旗木卡卡西",
					"age": 25,
					"gender": "男"
				},
				{
					"name": "野原新之助",
					"age": 5,
					"gender": "男"
				},
				{
					"name": "藤原拓海",
					"age": 20,
					"gender": "男"
				},
				{
					"name": "朽木露基亚",
					"age": 18,
					"gender": "女"
				},
				{
					"name": "毛利兰",
					"age": 18,
					"gender": "女"
				},
				{
					"name": "江户川乱步",
					"age": "不详",
					"gender": "男"
				}
			],
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
			resetScrollBar: true,
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

		// actionName: 'save',
		// postData: { x: 2 },
		this.pagerGridOptions2 = {

			resource: $resource('/api/pages/1', null, {
				'get': {
					method: 'POST'
				}
			}),
			postData: { x: 3 },
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
				{field: 'gender', displayName: '性别(这是一个超长的 column 名称)', align: 'right', isHidden: true, tooltip: '这是一个测试'},
				{field: 'gender', displayName: '性别(这是一个超长的 column 名称)', align: 'right', isHidden: true, tooltip: '这是一个测试'},
				{field: 'gender', displayName: '性别(这是一个超长的 column 名称)', align: 'right', isHidden: true, tooltip: '这是一个测试'},
				{field: 'gender', displayName: '性别(这是一个超长的 column 名称)', align: 'right', isHidden: true, tooltip: '这是一个测试'},
				{field: 'gender', displayName: '性别(这是一个超长的 column 名称)', align: 'right', isHidden: true, tooltip: '这是一个测试'},
				{field: 'gender', displayName: '性别(这是一个超长的 column 名称)', align: 'right', isHidden: true, tooltip: '这是一个测试'},
				{field: 'gender', displayName: '性别(这是一个超长的 column 名称)', align: 'right', isHidden: true, tooltip: '这是一个测试'},
				{field: 'gender', displayName: '性别(这是一个超长的 column 名称)', align: 'right', isHidden: true, tooltip: '这是一个测试'},
				{field: 'gender', displayName: '性别(这是一个超长的 column 名称)', align: 'right', isHidden: true, tooltip: '这是一个测试'},
				{field: 'gender', displayName: '性别(这是一个超长的 column 名称)', align: 'right', isHidden: true, tooltip: '这是一个测试'},
				{field: 'gender', displayName: '性别(这是一个超长的 column 名称)', align: 'right', isHidden: true, tooltip: '这是一个测试'}
			],
			enableHiddenColumns: true,
			showPagination: false
		};

		this.gridOption4 = {

			resource: $resource('/api/pages/1'),
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
		this.gridOption6 = {

			resource: $resource('/api/pages/1'),
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
			},
			// transformer: function (res) {
			// 	console.log(res);
			// 	return [];
			// }

			footerTpl: '/demos/components/grid/customer-footer.tpl.html'

		};

	});

