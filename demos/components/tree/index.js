/*
 * @Author: fang.yang
 * @Date: 2018-10-30 09:54:52
 */

;(function (angular, undefined) {
	'use strict';

	angular.module('demoApp', ['ccms.components'])
			.controller('DemoCtrl', DemoCtrl);

	DemoCtrl.$inject = [];
	function DemoCtrl() {

		this.select = function(item, data) {
			console.log(item);
			console.log(data);
		};

		this.onClick = function(nodeId, nodeName) {
			console.log('当前点击的节点id：' + nodeId, '节点名称：' + nodeName);
		};

		this.onAdd = function(parentId, name) {
			console.log('新增节点的父级id：' + parentId, '节点名称：' + name);
		};

		this.onRename = function(nodeId, nodeName) {
			console.log('重命名的节点id：' + nodeId, '节点名称：' + nodeName);
		};

		this.onRemove = function(nodeId) {
			console.log('删除的节点id：' + nodeId);
		};

		this.tree = {
			id: 1,
			name: '所有',
			parentId: null,
			categoryType: 0,
			isClosed: false,
			children: [
				{
					id: 36,
					name: '85',
					parentId: 1,
					categoryType: 0,
					isClosed: false,
					children: [
						{
							id: 123,
							name: '22323',
							parentId: 36,
							categoryType: 0,
							isClosed: false,
							parent: {
								id: 36,
								name: '85',
								parentId: 1,
								categoryType: 0,
								isClosed: false,
								parent: {
									id: 1,
									name: '所有',
									parentId: null,
									categoryType: 0,
									isClosed: false
								}
							}
						}
					],
					parent: {
						id: 1,
						name: '所有',
						parentId: null,
						categoryType: 0,
						isClosed: false
					}
				}, {
					id: 98,
					name: 'WYY分',
					parentId: 1,
					categoryType: 0,
					isClosed: false,
					children: [
						{
							id: 102,
							name: 'miaomiaozhu0620',
							parentId: 98,
							categoryType: 1,
							isClosed: false,
							parent: {
								id: 98,
								name: 'WYY分',
								parentId: 1,
								categoryType: 0,
								isClosed: false,
								parent: {
									id: 1,
									name: '所有',
									parentId: null,
									categoryType: 0,
									isClosed: false
								}
							},
							children: [
								{
									id: 111,
									name: '2345',
									parentId: 102,
									categoryType: 0,
									isClosed: false,
									parent: {
										id: 102,
										name: 'miaomiaozhu0620',
										parentId: 98,
										categoryType: 1,
										isClosed: false,
										parent: {
											id: 98,
											name: 'WYY分',
											parentId: 1,
											categoryType: 0,
											isClosed: false,
											parent: {
												id: 1,
												name: '所有',
												parentId: null,
												categoryType: 0,
												isClosed: false
											}
										}
									}
								}
							]
						}, {
							id: 101,
							name: 'lerous',
							parentId: 98,
							categoryType: 1,
							isClosed: false,
							parent: {
								id: 98,
								name: 'WYY分',
								parentId: 1,
								categoryType: 0,
								isClosed: false,
								parent: {
									id: 1,
									name: '所有',
									parentId: null,
									categoryType: 0,
									isClosed: false
								}
							}
						}
					],
					parent: {
						id: 1,
						name: '所有',
						parentId: null,
						categoryType: 0,
						isClosed: false
					}
				}, {
					id: 2,
					name: '未分类',
					parentId: 1,
					categoryType: 0,
					isClosed: false,
					parent: {
						id: 1,
						name: '所有',
						parentId: null,
						categoryType: 0,
						isClosed: false
					}
				}
			]
		};
	}
})(window.angular);
