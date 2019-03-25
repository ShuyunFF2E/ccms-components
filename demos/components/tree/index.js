/*
 * @Author: fang.yang
 * @Date: 2018-10-30 09:54:52
 */
// 搜索、菜单、复选
const tree_one = {
	// 是否支持菜单
	supportMenu: true,

	// 为空提示
	searchPlaceholder: '请输入搜索词',

	// 搜索区域的最大长度
	searchMaxLen: 20,

	// 节点名称最大长度
	nodeMaxLen: 5,

	// 最大层级
	maxLevel: 3,

	// 是否支持选择框
	supportCheckbox: true,

	// 是否为单选模式
	isRadioModel: false,

	// 是否支持搜索框
	supportSearch: true,

	// 新节点添加后所在的位置
	addToPosition: 'before',

	// 右键菜单: 新增节点处理器
	onAddAction: (pId, name) => {
		// 这里需要模拟一条API请求
		console.info(`向后端发送了一条新增请求，参数为{pId:${pId}, name: ${name}}`);
		return new Promise((resolve, reject) => {
			resolve({id: Math.random()});
			// reject('error');
		});
	},

	// 右键菜单: 重命名节点处理器
	onRenameAction: (node, newName) => {
		// 这里需要模拟一条API请求
		console.info(`向后端发送了一条修改请求，参数为{id:${node.id}, name: ${newName}}`);
		return new Promise((resolve, reject) => {
			resolve();
			// reject('重命名失败了');
		});
	},

	// 右键菜单: 删除节点处理器
	onRemoveAction: node => {
		// 这里需要模拟一条API请求
		console.info(`向后端发送了一条删除请求，参数为{id:${node.id}}`);
		return new Promise((resolve, reject) => {
			resolve();
			// reject('该节点不允许删除');
		});
	},

	// 节点选中回调
	onSelectedAction: (node, selectedList) => {
		console.log(node, selectedList);
	},

	data: [{
		id: 1,
		name: '所有',
		pId: null,
		children: [
			{
				id: 11,
				name: '禁止新增节点禁止新增节点禁止新增节点禁止新增节点禁止新增节点',
				pId: 1,
				disableAdd: true,
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
				name: '禁止删除节点',
				pId: 1,
				disableRemove: true,
				children: [
					{
						id: 121,
						name: '禁止重命名节点',
						pId: 12,
						disableRename: true,
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
					}, {
						id: 123,
						name: 'baukh321',
						pId: 12
					}, {
						id: 124,
						name: 'bauh789',
						pId: 12
					}, {
						id: 125,
						name: 'baukh',
						pId: 12
					}
				]
			}, {
				id: 13,
				name: '未分类',
				pId: 1
			}
		]
	}]
};

// 无搜索、无菜单、带单选
const tree_two = {
	// 是否支持选择框
	supportCheckbox: true,

	// 是否为单选模式
	isRadioModel: true,

	// 是否支持搜索框
	supportSearch: false,

	// 节点选中回调
	onSelectedAction: (node, selectedList) => {
		console.log(node, selectedList);
	},

	data: [{
		id: 1,
		name: '所有',
		pId: null,
		children: [
			{
				id: 11,
				name: '85',
				pId: 1,
				children: [
					{
						id: 111,
						name: '2232322323223232232322323223232232322323',
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
					}, {
						id: 123,
						name: 'baukh321',
						pId: 12
					}, {
						id: 124,
						name: 'bauh789',
						pId: 12
					}, {
						id: 125,
						name: 'baukh',
						pId: 12
					}
				]
			}, {
				id: 13,
				name: '未分类',
				pId: 1
			}
		]
	}]
};

// 无搜索、无选择
const tree_three = {
	// 是否支持菜单
	supportMenu: true,

	// 节点选中回调
	onSelectedAction: (node, selectedList) => {
		console.log(node, selectedList);
	},


	// 右键菜单: 新增节点处理器
	onAddAction: (pId, name) => {
		// 这里需要模拟一条API请求
		console.info(`向后端发送了一条新增请求，参数为{pId:${pId}, name: ${name}}`);
		return new Promise((resolve, reject) => {
			resolve({id: Math.random()});
			// reject('error');
		});
	},

	// 右键菜单: 重命名节点处理器
	onRenameAction: (node, newName) => {
		// 这里需要模拟一条API请求
		console.info(`向后端发送了一条修改请求，参数为{id:${node.id}, name: ${newName}}`);
		return new Promise((resolve, reject) => {
			resolve();
			// reject('重命名失败了');
		});
	},

	// 右键菜单: 删除节点处理器
	onRemoveAction: node => {
		// 这里需要模拟一条API请求
		console.info(`向后端发送了一条删除请求，参数为{id:${node.id}}`);
		return new Promise((resolve, reject) => {
			resolve();
			// reject('该节点不允许删除');
		});
	},

	data: [{
		id: 1,
		name: '所有',
		pId: null,
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
						checked: true,
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
						isSelected: true,
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
					}, {
						id: 123,
						name: 'baukh321',
						pId: 12
					}, {
						id: 124,
						name: 'bauh789',
						pId: 12
					}, {
						id: 125,
						name: 'baukh',
						pId: 12
					}
				]
			}, {
				id: 13,
				name: '未分类',
				pId: 1
			}
		]
	}]
};
;(function(angular) {
	'use strict';

	angular.module('demoApp', ['ccms.components'])
			.controller('DemoCtrl', DemoCtrl);

	DemoCtrl.$inject = [];
	function DemoCtrl() {

		// 搜索、菜单、复选
		this.tree_one = tree_one;

		// 无搜索、无菜单、带单选
		this.tree_two = tree_two;

		// 无搜索、无选择、无菜单
		this.tree_three = tree_three;
	}
})(window.angular);
