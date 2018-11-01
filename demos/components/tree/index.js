/*
 * @Author: fang.yang
 * @Date: 2018-10-30 09:54:52
 */

;(function(angular) {
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

		this.onAdd = function(pId, name) {
			console.log('新增节点的父级id：' + pId, '节点名称：' + name);
		};

		this.onRename = function(nodeId, nodeName) {
			console.log('重命名的节点id：' + nodeId, '节点名称：' + nodeName);
		};

		this.onRemove = function(nodeId) {
			console.log('删除的节点id：' + nodeId);
		};

		this.onAddAction = function(pId, name) {
			// 这里需要模拟一条API请求
			console.info(`向后端发送了一条请求，参数为{pId:${pId}, name: ${name}}`);
			return new Promise((resolve, reject) => {
				resolve('id', 6);
			});
		};

		this.hideRoot = true;
		this.tree = [{
			id: 1,
			name: '所有',
			pId: null,
			isClosed: false,
			children: [
				{
					id: 11,
					name: '85',
					pId: 1,
					isClosed: false,
					children: [
						{
							id: 111,
							name: '22323',
							pId: 11,
							categoryType: 0,
							isClosed: false
						}
					]
				}, {
					id: 12,
					name: 'WYY分',
					pId: 1,
					isClosed: false,
					children: [
						{
							id: 121,
							name: 'miaomiaozhu0620',
							pId: 12,
							isClosed: false,
							children: [
								{
									id: 1211,
									name: '2345',
									pId: 121,
									isClosed: false
								}
							]
						}, {
							id: 122,
							name: 'lerous',
							pId: 12,
							isClosed: false
						}
					]
				}, {
					id: 13,
					name: '未分类',
					pId: 1,
					isClosed: false
				}
			]
		}];
	}
})(window.angular);
