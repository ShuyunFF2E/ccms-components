import angular from 'angular';
import cloneDeep from 'lodash.clonedeep';

// 表示根的 parentId 的值
const ROOT = () => {};

export default class TreeCtrl {
	constructor() {
		// clone一份原始数据
		this.data = cloneDeep(this.treeData);

		// 临时存储遍历 nodeItem 的数据
		this.tempNodeItemData = null;
		// 存储所有 tree Items 上的 scope
		this.scopes = [];
		this.initNodeItemsStatus();
	}

	initNodeItemsStatus() {
		// 初始化数据, 为节点数据加上 parentId, 方便之后遍历使用
		this.findNodeItemDataById(null, this.data, ROOT, false);

		// 将用户传进来的已选中的节点ids, 将状态标记在数据中, 标注 checked 或 partial
		this.selectedIds && this.selectedIds.forEach(selectedId => {
			this.findNodeItemDataById(selectedId, this.data);
			if (this.tempNodeItemData) {
				if (this.hasCheckbox) {
					this.tempNodeItemData.checked = true;
					this.handleTreeCheckbox(this.tempNodeItemData);
				} else {
					this.tempNodeItemData.selected = true;
				}
			}
		});
	}

	/**
	 * 根据 id 查找 node item data, 查找到的数据存储在 this.tempNodeItemData 中
	 *
	 * @param id 被查找数据 id
	 * @param data 目标数据
	 * @param parentId 是否添加辅助数据 parentId
	 * @param isBreak 当找出目标数据是否跳出
	 * */
	findNodeItemDataById(id, data, parentId = false, isBreak = true) {
		if (!data || !data.length) return;

		for (let i = 0, len = data.length; i < len; i++) {

			if (parentId) {
				data[i].parentId = parentId;
			}

			if (id === data[i].id) {
				this.tempNodeItemData = data[i];
				if (isBreak) {
					break;
				}
			}

			let children = data[i].children;

			if (children && children.length > 0) {
				this.findNodeItemDataById(id, children, parentId !== false ? data[i].id : false, isBreak);
			}
		}
	}

	/*
	* 根据 id 查找原始 node item data
	* */
	findOriginNodeDataById(id) {
		this.findNodeItemDataById(id, this.treeData);
	}

	// 清除已选 tree Items
	clearSelected() {
		this.scopes.forEach(scope => {
			scope.$ctrl.selected = false;
		});
	}

	clickTreeItem($event) {
		const target = $event.target;
		const treeItemScope = angular.element(target).scope();
		if (target.classList.contains('treeLabel')) {
			if (!this.hasCheckbox) {
				this.clearSelected();
				treeItemScope.$ctrl.selected = true;
				this.findOriginNodeDataById(treeItemScope.$ctrl.data.id);
				this.onSelected && this.onSelected({item: cloneDeep(this.tempNodeItemData)});
			} else {
				this.handleTreeCheckbox(treeItemScope.$parent.$parent.$ctrl.data);
				this.findOriginNodeDataById(treeItemScope.$parent.$parent.$ctrl.data.id);
				this.onSelected && this.onSelected({item: cloneDeep(this.tempNodeItemData), checked: treeItemScope.$parent.$parent.$ctrl.data.checked});
			}
		}

		if (target.classList.contains('cc-checkbox-input')) {
			this.handleTreeCheckbox(treeItemScope.$parent.$ctrl.data);
			this.findOriginNodeDataById(treeItemScope.$parent.$ctrl.data.id);
			this.onSelected && this.onSelected({item: cloneDeep(this.tempNodeItemData), checked: treeItemScope.$parent.$ctrl.data.checked});
		}

		if (target.classList.contains('treeArrow')) {
			treeItemScope.$ctrl.showChildren = !treeItemScope.$ctrl.showChildren;
		}
	}

	// 处理树上 checkbox 的状态
	handleTreeCheckbox(treeItemData) {
		const treeItemChecked = treeItemData.checked;
		// 处理 child items
		this.checkChildItems(treeItemData, treeItemChecked);
		// 处理 parent items
		this.checkParentItems(this.data, treeItemData.parentId);
	}

	// 递归 child item, 对相应的节点 checkbox 状态赋值
	checkChildItems(treeItemData, checked) {
		treeItemData.children && treeItemData.children.forEach(child => {
			child.checked = checked;
			child.partial = false;
			this.checkChildItems(child, checked);
		});
	}

	// 递归 查找 parent items, 根据 child items 的状态判断 parent item checkbox 状态
	checkParentItems(data, parentId) {
		data && data.forEach(treeItemData => {
			if (treeItemData.id === parentId || parentId === ROOT) {
				treeItemData.checked = this.isAllChildrenChecked(treeItemData.children);
				if (!treeItemData.checked) {
					treeItemData.partial = this.isSomeChildrenChecked(treeItemData.children);
				} else {
					treeItemData.partial = false;
				}

				if (parentId !== ROOT) {
					this.checkParentItems(this.data, treeItemData.parentId);
				}

			} else {
				this.checkParentItems(treeItemData.children, parentId);
			}
		});
	}

	isAllChildrenChecked(children) {
		return children && children.every(child => {
			return child.checked;
		});
	}

	isSomeChildrenChecked(children) {
		return children && children.some(child => {
			return child.checked || child.partial;
		});
	}
}
