/*
 * @Author: fang.yang
 * @Date: 2018-10-30 09:54:52
 */

;(function(angular) {
	'use strict';

	angular.module('demoApp', ['ccms.components'])
			.controller('DemoCtrl', DemoCtrl);

	DemoCtrl.$inject = [];
	function DemoCtrl($scope) {

		// 是否支持复选框
		this.supportCheckbox = true;

		// 是否支持搜索框
		this.supportSearch = true;

		this.select = function(item, data) {
			console.log(item);
			console.log(data);
		};

		this.onClickAction = function(node) {
			console.log('当前点击的节点id：' + node.id, '节点名称：' + node.name);
		};

		this.onAddAction = function(pId, name) {
			// 这里需要模拟一条API请求
			console.info(`向后端发送了一条新增请求，参数为{pId:${pId}, name: ${name}}`);
			return new Promise((resolve, reject) => {
				resolve({id: Math.random()});
			});
		};

		this.onRenameAction = function(node) {
			// 这里需要模拟一条API请求
			console.info(`向后端发送了一条修改请求，参数为{id:${node.id}, name: ${node.name}}`);
			return new Promise((resolve, reject) => {
				resolve();
				// reject('重命名失败了');
			});
		};

		this.onRemoveAction = function(node) {
			// 这里需要模拟一条API请求
			console.info(`向后端发送了一条删除请求，参数为{id:${node.id}}`);
			return new Promise((resolve, reject) => {
				resolve();
				// reject('该节点不允许删除');
			});
		};

		this.onSelectedAction = function(node, selectedList) {
			console.log(node, selectedList);
		};

		this.tree = [{
			id: 1,
			name: '所有',
			pId: null,
			isRadioModel: true,
			children: [
				{
					id: 11,
					name: '85',
					pId: 1,
					children: [
						{
							id: 111,
							name: '22323',
							pId: 11,
							categoryType: 0
						}
					]
				}, {
					id: 12,
					name: 'WYY分',
					pId: 1,
					children: [
						{
							id: 121,
							name: 'miaomiaozhu0620',
							pId: 12,
							children: [
								{
									id: 1211,
									name: '2345',
									pId: 121
								}
							]
						}, {
							id: 122,
							name: 'lerous',
							pId: 12
						}
					]
				}, {
					id: 13,
					name: '未分类',
					pId: 1
				}
			]
		}];
	}
})(window.angular);
